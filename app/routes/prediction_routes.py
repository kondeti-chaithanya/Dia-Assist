from fastapi import APIRouter, HTTPException
from app.models.schemas import PatientInput
from app.services.prediction_service import predict_diabetes
from app.services.diet_service import generate_diet_plan

router = APIRouter()

@router.post("/predict_and_diet")
def predict_and_diet(data: PatientInput):
    try:
        response = predict_diabetes(data)
        response["diet_plan"] = generate_diet_plan(data)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction/Diet generation failed: {str(e)}"
        )
