# from fastapi import FastAPI, HTTPException #creates API server and handles errors
# from app.models.schemas import PatientInput
# from typing import List #type hints for lists

# from app.models.model_loader import prepare_input_row, model #load ML model and prepare input
# from diet_plan import get_diet_plan #Calls your ICMR/NIN-based diet logic

# app = FastAPI(title="Diabetes Prediction & Diet API") #Initializes API

# # # INPUT SCHEMA

# # class PatientInput(BaseModel):
# #     age: int
# #     gender: str
# #     smoking_history: str
# #     bmi: float
# #     HbA1c_level: float
# #     blood_glucose_level: float
# #     hypertension: int
# #     heart_disease: int
# #     other_diseases: List[str] = []

# def explain_prediction_simple(user: dict) -> str: #Generates simple explanation based on user data
#     reasons = []

#     if user["HbA1c_level"] >= 6.5:
#         reasons.append(
#             "your long-term blood sugar level (HbA1c) is higher than normal"
#         )

#     if user["blood_glucose_level"] >= 126:
#         reasons.append(
#             "your blood sugar level is above the healthy range"
#         )

#     if user["bmi"] >= 25:
#         reasons.append(
#             "your body weight may be affecting how insulin works"
#         )

#     if user["hypertension"] == 1:
#         reasons.append(
#             "high blood pressure is often linked with diabetes risk"
#         )

#     if user["smoking_history"].lower() in ["current", "former"]:
#         reasons.append(
#             "smoking can increase blood sugar-related problems"
#         )

#     # Base explanation
#     explanation = (
#         "You may be at risk of diabetes because "
#         + ", and ".join(reasons)
#         + "."
#         if reasons
#         else
#         "Your result is based on a combination of health parameters."
#     )

#     # Positive, reassuring guidance (VERY IMPORTANT)
#     explanation += (
#         " Following the recommended diet plan and healthy lifestyle habits "
#         "may help improve blood sugar control and reduce future diabetes risk. "
#     )

#     return explanation

# # SINGLE ENDPOINT
# @app.post("/predict_and_diet") #
# def predict_and_diet(data: PatientInput):
   

#     try:
#         # ---- ML Prediction ----
#         df = prepare_input_row(data.dict())
#         prediction = int(model.predict(df)[0])

#         # ---- Diet Plan ----
#         diet_plan = get_diet_plan(data.dict())

#         # ---- Base Response ----
#         response = {
#             "prediction": prediction,
#             "message": "Diabetes Detected" if prediction == 1 else "No Diabetes",
#             "diet_plan": diet_plan
#         }

#         # Explanation ONLY for diabetic users
#         if prediction == 1:
#             response["why_this_result"] = explain_prediction_simple(data.dict())

#         return response

#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Prediction/Diet generation failed: {str(e)}"
#         )

# from fastapi import FastAPI, HTTPException
# from app.models.schemas import PatientInput
# from app.services.prediction_service import predict_diabetes
# from app.services.diet_service import generate_diet_plan

# app = FastAPI(title="Diabetes Prediction & Diet API")

# @app.post("/predict_and_diet")
# def predict_and_diet(data: PatientInput):
#     try:
#         response = predict_diabetes(data)
#         response["diet_plan"] = generate_diet_plan(data)
#         return response

#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"Prediction/Diet generation failed: {str(e)}"
#         )

from fastapi import FastAPI
from app.routes.prediction_routes import router as prediction_router

app = FastAPI(title="Diabetes Prediction & Diet API")

app.include_router(prediction_router)
