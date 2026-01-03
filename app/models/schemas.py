from pydantic import BaseModel #data validation
from typing import List #type hints for lists

# INPUT SCHEMA

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