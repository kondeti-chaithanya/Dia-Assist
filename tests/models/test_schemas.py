import pytest 
from app.models.schemas import PatientInput

def test_patient_input_valid():
    data = {
        "age": 40,
        "gender": "male",
        "smoking_history": "never",
        "bmi": 24.5,
        "HbA1c_level": 5.8,
        "blood_glucose_level": 110,
        "hypertension": 0,
        "heart_disease": 0,
        "other_diseases": []
    }

    patient = PatientInput(**data)
    assert patient.age == 40 


def test_patient_input_invalid_age():
    data = {
        "age": -1,
        "gender": "male",
        "smoking_history": "never",
        "bmi": 24.5,
        "HbA1c_level": 5.8,
        "blood_glucose_level": 110,
        "hypertension": 0,
        "heart_disease": 0
    }

    with pytest.raises(Exception):
        PatientInput(**data)
