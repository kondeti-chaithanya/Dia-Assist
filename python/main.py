from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

from model_loader import prepare_input_row, model
from diet_plan import get_diet_plan

app = FastAPI(title="Diabetes Prediction & Diet API")


# -----------------------------
# INPUT SCHEMA
# -----------------------------
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


# -----------------------------
# SIMPLE, USER-FRIENDLY EXPLANATION
# (ONLY FOR DIABETIC USERS)
# -----------------------------
def explain_prediction_simple(user: dict) -> str:
    reasons = []

    if user["HbA1c_level"] >= 6.5:
        reasons.append(
            "your long-term blood sugar level (HbA1c) is higher than normal"
        )

    if user["blood_glucose_level"] >= 126:
        reasons.append(
            "your blood sugar level is above the healthy range"
        )

    if user["bmi"] >= 25:
        reasons.append(
            "your body weight may be affecting how insulin works"
        )

    if user["hypertension"] == 1:
        reasons.append(
            "high blood pressure is often linked with diabetes risk"
        )

    if user["smoking_history"].lower() in ["current", "former"]:
        reasons.append(
            "smoking can increase blood sugar-related problems"
        )

    # Base explanation
    explanation = (
        "You may be at risk of diabetes because "
        + ", and ".join(reasons)
        + "."
        if reasons
        else
        "Your result is based on a combination of health parameters."
    )

    # ✅ Positive, reassuring guidance (VERY IMPORTANT)
    explanation += (
        " Following the recommended diet plan and healthy lifestyle habits "
        "may help improve blood sugar control and reduce future diabetes risk. "
    )

    return explanation

# SINGLE ENDPOINT
@app.post("/predict_and_diet")
def predict_and_diet(data: PatientInput):
    """
    - Predicts diabetes risk using ML
    - Generates explanation ONLY if diabetic
    - Generates diet plan for all users
    """

    try:
        # ---- ML Prediction ----
        df = prepare_input_row(data.dict())
        prediction = int(model.predict(df)[0])

        # ---- Diet Plan ----
        diet_plan = get_diet_plan(data.dict())

        # ---- Base Response ----
        response = {
            "prediction": prediction,
            "message": "Diabetes Detected" if prediction == 1 else "No Diabetes",
            "diet_plan": diet_plan
        }

        # Explanation ONLY for diabetic users
        if prediction == 1:
            response["why_this_result"] = explain_prediction_simple(data.dict())

        return response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction/Diet generation failed: {str(e)}"
        )
