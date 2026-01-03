from pydantic import BaseModel, Field #data validation
from typing import List #type hints for lists

# INPUT SCHEMA

class PatientInput(BaseModel):
    age: int = Field(..., gt=0)
    gender: str
    smoking_history: str
    bmi: float = Field(..., gt=0)
    HbA1c_level: float = Field(..., ge=0)
    blood_glucose_level: float = Field(..., ge=0)
    hypertension: int
    heart_disease: int
    other_diseases: List[str] = []