from fastapi import APIRouter
from models.chat_models import ChatRequest, ChatResponse, HistoryResponse
from services.retrieval import hybrid_search
from services.llm_service import generate_llm_answer

router = APIRouter()

chat_history = []

@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest):

    retrieved = hybrid_search(req.question)
    answer = generate_llm_answer(req.question, retrieved)

    chat_history.append({
        "user": req.question,
        "bot": answer
    })

    # Return only the answer
    return ChatResponse(answer=answer)


@router.get("get_histoy", response_model=HistoryResponse)
def get_history():
    return HistoryResponse(chat_history=chat_history)
