from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from session_manager import session_manager
from services.retrieval_service import hybrid_search
from services.llm_service import generate_llm_answer

from auth import verify_jwt_token

router = APIRouter()
security = HTTPBearer()


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    user_id: str
    has_assessment: bool
    message_count: int


class UpdateDataRequest(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    hypertension: Optional[int] = None
    heart_disease: Optional[int] = None
    smoking_history: Optional[str] = None
    bmi: Optional[float] = None
    HbA1c_level: Optional[float] = None
    blood_glucose_level: Optional[float] = None
    other_diseases: Optional[List[str]] = None
    session_id: Optional[str] = None


class UpdateDataRequest(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    hypertension: Optional[int] = None
    heart_disease: Optional[int] = None
    smoking_history: Optional[str] = None
    bmi: Optional[float] = None
    HbA1c_level: Optional[float] = None
    blood_glucose_level: Optional[float] = None


@router.post("/ask", response_model=ChatResponse)
async def chat_with_bot(
    request: ChatRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Main chatbot endpoint with JWT authentication
    - Retrieves user's ML result from token-based session
    - Uses RAG to get textbook context
    - Generates personalized response
    """
    try:
        # Verify JWT and get user_id
        user_info = await verify_jwt_token(credentials.credentials)
        user_id = str(user_info.get("user_id") or user_info.get("sub") or user_info.get("id"))
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not extract user_id from token"
            )
        
        question = request.question.strip()
        
        if not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question cannot be empty"
            )
        
        if len(question) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question too long (max 500 characters)"
            )
        
        print(f" User {user_id} asked: {question[:50]}...")
        
        # Get or create user session
        session_manager.get_or_create_session(user_id)
        
        # Retrieve ML result (if exists)
        ml_result = session_manager.get_ml_result(user_id)
        
        # Get chat history
        chat_history = session_manager.get_chat_history(user_id)
        
        # Retrieve relevant textbook chunks using RAG
        retrieved_chunks = hybrid_search(question, top_k=10)
        
        # Generate answer using LLM
        answer = generate_llm_answer(
            question=question,
            retrieved_chunks=retrieved_chunks,
            ml_result=ml_result,
            chat_history=chat_history
        )
        
        # Store chat message
        session_manager.add_chat_message(user_id, question, answer)
        
        print(f" Response generated for user {user_id}")
        
        return ChatResponse(
            answer=answer,
            user_id=user_id,
            has_assessment=ml_result is not None,
            message_count=len(chat_history) + 1
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        print(f" Chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process question: {str(e)}"
        )


@router.get("/history")
async def get_chat_history(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get user's chat history"""
    try:
        user_info = await verify_jwt_token(credentials.credentials)
        user_id = str(user_info.get("user_id") or user_info.get("sub") or user_info.get("id"))
        
        chat_history = session_manager.get_chat_history(user_id)
        
        return {
            "user_id": user_id,
            "message_count": len(chat_history),
            "history": chat_history
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.delete("/history")
async def clear_history(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Clear user's chat history"""
    try:
        user_info = await verify_jwt_token(credentials.credentials)
        user_id = str(user_info.get("user_id") or user_info.get("sub") or user_info.get("id"))
        
        session_manager.clear_chat_history(user_id)
        
        return {
            "message": "Chat history cleared",
            "user_id": user_id
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.get("/assessment")
async def get_user_assessment(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Get user's health assessment result"""
    try:
        user_info = await verify_jwt_token(credentials.credentials)
        user_id = str(user_info.get("user_id") or user_info.get("sub") or user_info.get("id"))
        
        ml_result = session_manager.get_ml_result(user_id)
        
        if not ml_result:
            return {
                "has_assessment": False,
                "message": "No assessment completed yet"
            }
        
        return {
            "has_assessment": True,
            "result": ml_result
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )


@router.post("/update-data")
async def update_user_data(
    request: UpdateDataRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """Update user's health data"""
    try:
        user_info = await verify_jwt_token(credentials.credentials)
        user_id = str(user_info.get("user_id") or user_info.get("sub") or user_info.get("id"))
        
        # Get current session
        session = session_manager.get_or_create_session(user_id)
        ml_result = session.get("ml_result")
        
        # Prepare user_data
        if ml_result:
            user_data = ml_result.get("user_data", {})
        else:
            user_data = {}
        
        updates = request.dict(exclude_unset=True)
        
        # Filter out non-model fields
        model_fields = {
            "age", "gender", "hypertension", "heart_disease", 
            "smoking_history", "bmi", "HbA1c_level", "blood_glucose_level"
        }
        filtered_updates = {k: v for k, v in updates.items() if k in model_fields and v is not None}
        
        user_data.update(filtered_updates)
        
        # Ensure required fields are present
        required_fields = ["age", "gender", "bmi", "HbA1c_level", "blood_glucose_level"]
        missing = [f for f in required_fields if f not in user_data]
        if missing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Missing required fields: {', '.join(missing)}"
            )
        
        # Run prediction
        from model_loader import prepare_input_row, model
        df = prepare_input_row(user_data)
        prediction = model.predict(df)[0]
        
        # Calculate diet plan
        from diet_plan import get_diet_plan
        diet_plan = get_diet_plan(user_data)
        
        # Create/update ml_result
        updated_ml_result = {
            "user_data": user_data,
            "prediction": int(prediction),
            "diet_plan": diet_plan,
            "message": "Diabetes detected" if prediction == 1 else "No diabetes"
        }
        
        session_manager.store_ml_result(user_id, updated_ml_result)
        
        action = "updated" if ml_result else "created"
        return {
            "message": f"User data {action} successfully",
            "updated_data": user_data,
            "new_prediction": updated_ml_result["message"]
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Update failed: {str(e)}"
        )