# from fastapi import FastAPI, HTTPException, Depends, status
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# from pydantic import BaseModel
# from typing import Optional, List
# from datetime import datetime
# from services.ingest_service import ingest_pdf
# import os

# from session_manager import session_manager
# from services.retrieval_service import hybrid_search
# from services.llm_service import generate_llm_answer
# from diet_plan import get_diet_plan, explain_prediction_simple
# from model_loader import prepare_input_row, model
# from auth import verify_jwt_token

# # ═══════════════════════════════════════════════════════
# # APP INITIALIZATION
# # ═══════════════════════════════════════════════════════

# app = FastAPI(
#     title="DiaBot - Diabetes Expert Chatbot",
#     description="RAG-based diabetes assistant with personalized health guidance",
#     version="2.0.0"
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # tighten in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# security = HTTPBearer()

# # ═══════════════════════════════════════════════════════
# # VECTOR INDEX INITIALIZATION (ONE-TIME, PDF BASED)
# # ═══════════════════════════════════════════════════════

# if not os.path.exists("vector_index/store.pkl"):
#     print("📘 Ingesting Dia-Textbook (PDF)...")
#     from services.ingest_service import ingest_pdf
#     ingest_pdf("data/dia-textbook.pdf")
#     print("✅ PDF ingestion complete!")

# # ═══════════════════════════════════════════════════════
# # PYDANTIC MODELS
# # ═══════════════════════════════════════════════════════

# class ChatRequest(BaseModel):
#     question: str

# class ChatResponse(BaseModel):
#     answer: str
#     user_id: str
#     has_assessment: bool
#     message_count: int

# class PatientInput(BaseModel):
#     age: int
#     gender: str
#     bmi: float
#     HbA1c_level: float
#     blood_glucose_level: float
#     hypertension: int
#     heart_disease: int
#     smoking_history: str
#     other_diseases: Optional[List[str]] = []

# class PredictionResponse(BaseModel):
#     user_id: str
#     prediction: int
#     message: str
#     diet_plan: dict
#     user_data: dict
#     why_this_result: str
#     timestamp: str

# class ChatHistoryResponse(BaseModel):
#     user_id: str
#     message_count: int
#     history: List[dict]

# # ═══════════════════════════════════════════════════════
# # JWT HELPER
# # ═══════════════════════════════════════════════════════


# async def get_user_id_from_token(credentials: HTTPAuthorizationCredentials) -> str:
#     user_info = await verify_jwt_token(credentials.credentials)
#     user_id = str(
#         user_info.get("user_id")
#         or user_info.get("sub")
#         or user_info.get("id")
#     )
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Could not extract user_id from token"
#         )
#     return user_id

# # ═══════════════════════════════════════════════════════
# # ENDPOINT 1: CHAT
# # ═══════════════════════════════════════════════════════

# @app.post("/chat", response_model=ChatResponse, tags=["DiaBot"])
# async def chat_with_diabot(
#     request: ChatRequest,
#     credentials: HTTPAuthorizationCredentials = Depends(security)
# ):
#     try:
#         user_id = await get_user_id_from_token(credentials)
#         question = request.question.strip()

#         if not question:
#             raise HTTPException(status_code=400, detail="Question cannot be empty")
#         if len(question) > 500:
#             raise HTTPException(status_code=400, detail="Question too long")

#         session_manager.get_or_create_session(user_id)
#         ml_result = session_manager.get_ml_result(user_id)
#         chat_history = session_manager.get_chat_history(user_id)

#         retrieved_chunks = hybrid_search(question, top_k=10)

#         answer = generate_llm_answer(
#             question=question,
#             retrieved_chunks=retrieved_chunks,
#             ml_result=ml_result,
#             chat_history=chat_history
#         )

#         session_manager.add_chat_message(user_id, question, answer)

#         return ChatResponse(
#             answer=answer,
#             user_id=user_id,
#             has_assessment=ml_result is not None,
#             message_count=len(chat_history) + 1
#         )

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # ═══════════════════════════════════════════════════════
# # ENDPOINT 2: PREDICT + DIET
# # ═══════════════════════════════════════════════════════

# @app.post("/predict_and_diet", response_model=PredictionResponse, tags=["DiaBot"])
# async def predict_and_generate_diet(
#     data: PatientInput,
#     credentials: HTTPAuthorizationCredentials = Depends(security)
# ):
#     try:
#         user_id = await get_user_id_from_token(credentials)

#         df = prepare_input_row(data.dict())
#         prediction = int(model.predict(df)[0])

#         diet_plan = get_diet_plan(data.dict())
#         why_result = explain_prediction_simple(data.dict()) if prediction == 1 else ""

#         response = PredictionResponse(
#             user_id=user_id,
#             prediction=prediction,
#             message="Diabetes Risk Detected" if prediction == 1 else "No Diabetes Detected",
#             diet_plan=diet_plan,
#             user_data=data.dict(),
#             why_this_result=why_result,
#             timestamp=datetime.now().isoformat()
#         )

#         session_manager.store_ml_result(user_id, response.dict())
#         return response

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# # ═══════════════════════════════════════════════════════
# # ENDPOINT 3: CHAT HISTORY
# # ═══════════════════════════════════════════════════════

# @app.get("/chat_history", response_model=ChatHistoryResponse, tags=["DiaBot"])
# async def get_chat_history(
#     credentials: HTTPAuthorizationCredentials = Depends(security)
# ):
#     user_id = await get_user_id_from_token(credentials)
#     history = session_manager.get_chat_history(user_id)

#     return ChatHistoryResponse(
#         user_id=user_id,
#         message_count=len(history),
#         history=history
#     )

# # ═══════════════════════════════════════════════════════
# # SYSTEM
# # ═══════════════════════════════════════════════════════

# @app.get("/health")
# def health():
#     return {
#         "status": "healthy",
#         "active_users": len(session_manager.user_sessions)
#     }

# @app.get("/")
# def root():
#     return {
#         "service": "DiaBot",
#         "version": "2.0.0",
#         "docs": "/docs"
#     }


from fastapi import FastAPI, HTTPException, Depends, status, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os

from session_manager import session_manager
from services.retrieval_service import hybrid_search
from services.llm_service import generate_llm_answer
from services.ingest_service import ingest_pdf
from diet_plan import get_diet_plan, explain_prediction_simple
from model_loader import prepare_input_row, model
from auth import validate_user_id

# ═══════════════════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════════════════

app = FastAPI(
    title="DiaBot - Diabetes Expert Chatbot",
    description="RAG-based diabetes assistant with personalized health guidance",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════
# STARTUP SAFETY CHECK (NO INGESTION HERE ❌)
# ═══════════════════════════════════════════════════════

VECTOR_INDEX_PATH = "vector_index/store.pkl"

if not os.path.exists(VECTOR_INDEX_PATH):
    print("⚠️ Vector index not found. Chatbot will run without PDF knowledge.")

# ═══════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    user_id: str
    has_assessment: bool
    message_count: int

class PatientInput(BaseModel):
    age: int
    gender: str
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float
    hypertension: int
    heart_disease: int
    smoking_history: str
    other_diseases: Optional[List[str]] = []

class PredictionResponse(BaseModel):
    user_id: str
    prediction: int
    message: str
    diet_plan: dict
    user_data: dict
    why_this_result: str
    timestamp: str

class ChatHistoryResponse(BaseModel):
    user_id: str
    message_count: int
    history: List[dict]

# ═══════════════════════════════════════════════════════
# ENDPOINT 1: CHAT (RAG + LLM)
# ═══════════════════════════════════════════════════════

@app.post("/chat", response_model=ChatResponse, tags=["DiaBot"])
async def chat_with_diabot(
    chat_request: ChatRequest,
    http_request: Request,
    x_user_id: str = Header(None)
):
    try:
        # Extract user_id from header with debug
        print(f"\n🔍 DEBUG HEADERS:")
        print(f"   All headers: {dict(http_request.headers)}")
        
        user_id = x_user_id or http_request.headers.get("x-user-id") or http_request.headers.get("X-User-Id") or http_request.headers.get("X-User-ID")
        
        if not user_id:
            print(f"❌ NO USER_ID FOUND IN HEADERS")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="X-User-Id header is required"
            )
        
        try:
            user_id = validate_user_id(user_id)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e)
            )
        
        print(f"✅ User ID from header: {user_id}")
        
        question = chat_request.question.strip()

        if not question:
            raise HTTPException(status_code=400, detail="Question cannot be empty")
        if len(question) > 500:
            raise HTTPException(status_code=400, detail="Question too long")

        session_manager.get_or_create_session(user_id)
        ml_result = session_manager.get_ml_result(user_id)
        chat_history = session_manager.get_chat_history(user_id)

        retrieved_chunks = (
            hybrid_search(question, top_k=10)
            if os.path.exists(VECTOR_INDEX_PATH)
            else []
        )

        answer = generate_llm_answer(
            question=question,
            retrieved_chunks=retrieved_chunks,
            ml_result=ml_result,
            chat_history=chat_history
        )

        session_manager.add_chat_message(user_id, question, answer)

        return ChatResponse(
            answer=answer,
            user_id=user_id,
            has_assessment=ml_result is not None,
            message_count=len(chat_history) + 1
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═══════════════════════════════════════════════════════
# ENDPOINT 2: PREDICTION + DIET
# ═══════════════════════════════════════════════════════

@app.post("/predict_and_diet", response_model=PredictionResponse, tags=["DiaBot"])
async def predict_and_generate_diet(
    data: PatientInput,
    http_request: Request,
    x_user_id: str = Header(None)
):
    try:
        # Extract user_id from header with debug
        print(f"\n🔍 DEBUG HEADERS (Predict):")
        print(f"   All headers: {dict(http_request.headers)}")
        
        user_id = x_user_id or http_request.headers.get("x-user-id") or http_request.headers.get("X-User-Id") or http_request.headers.get("X-User-ID")
        
        if not user_id:
            print(f"❌ NO USER_ID FOUND IN HEADERS")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="X-User-Id header is required"
            )
        
        try:
            user_id = validate_user_id(user_id)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e)
            )
        
        print(f"✅ User ID from header: {user_id}")
        
        df = prepare_input_row(data.dict())
        prediction = int(model.predict(df)[0])

        diet_plan = get_diet_plan(data.dict())
        why_result = (
            explain_prediction_simple(data.dict())
            if prediction == 1 else ""
        )

        response = PredictionResponse(
            user_id=user_id,
            prediction=prediction,
            message="Diabetes Risk Detected"
            if prediction == 1 else "No Diabetes Detected",
            diet_plan=diet_plan,
            user_data=data.dict(),
            why_this_result=why_result,
            timestamp=datetime.now().isoformat()
        )

        session_manager.store_ml_result(user_id, response.dict())
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ═══════════════════════════════════════════════════════
# ENDPOINT 3: CHAT HISTORY
# ═══════════════════════════════════════════════════════

@app.get("/chat_history", response_model=ChatHistoryResponse, tags=["DiaBot"])
async def get_chat_history(
    http_request: Request,
    x_user_id: str = Header(None)
):
    # Extract user_id from header
    user_id = x_user_id or http_request.headers.get("x-user-id") or http_request.headers.get("X-User-Id") or http_request.headers.get("X-User-ID")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-User-Id header is required"
        )
    
    try:
        user_id = validate_user_id(user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    
    history = session_manager.get_chat_history(user_id)

    return ChatHistoryResponse(
        user_id=user_id,
        message_count=len(history),
        history=history
    )

# ═══════════════════════════════════════════════════════
# ADMIN: MANUAL PDF INGESTION (SAFE)
# ═══════════════════════════════════════════════════════

@app.post("/admin/ingest", tags=["Admin"])
def ingest_knowledge_base():
    ingest_pdf("data/dia-textbook.pdf")
    return {"status": "PDF ingestion triggered"}

# ═══════════════════════════════════════════════════════
# SYSTEM HEALTH
# ═══════════════════════════════════════════════════════

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "healthy",
        "active_users": len(session_manager.user_sessions)
    }
@app.get("/health")
def health():
    return {"status": "ok"}
