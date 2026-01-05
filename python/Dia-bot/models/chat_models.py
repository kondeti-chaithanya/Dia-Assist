from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str

class HistoryResponse(BaseModel):
    chat_history: List[Dict[str, Any]]
