from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    session_id: str

class HistoryResponse(BaseModel):
    chat_history: List[dict]

class PatientInput(BaseModel):
    age: int
    gender: str
    smoking_history: str
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float
    hypertension: int
    heart_disease: int
    other_diseases: List[str] = []
    session_id: Optional[str] = None