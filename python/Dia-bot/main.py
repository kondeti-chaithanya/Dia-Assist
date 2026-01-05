# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routers.chat_router import router
# import os

# from services.ingest_service import ingest_pdf


# app = FastAPI(title="Diabetes RAG Chatbot")



# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],   
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



# if not os.path.exists("vector_index/store.pkl"):
#     print(" Ingesting diabetes textbook...")
#     ingest_pdf("data/dia-textbook.pdf")
#     print(" Ingestion complete!")




# app.include_router(router, prefix="/chat", tags=["Chatbot"])



# @app.get("/")
# def home():
#     return {"message": "Diabetes RAG Chatbot is running!"}

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers.chat_router import router
import os

# -------- RAG INGESTION --------
from services.ingest_service import ingest_pdf

# -------- PREDICTION + DIET --------
from pydantic import BaseModel
from typing import List
from model_loader import prepare_input_row, model
from diet_plan import get_diet_plan


# ✅ SINGLE FASTAPI APP
app = FastAPI(title="Dia Assist – Chatbot + Prediction + Diet API")

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- VECTOR INGEST (RUN ONCE) --------
if not os.path.exists("vector_index/store.pkl"):
    print("📘 Ingesting diabetes textbook...")
    ingest_pdf("data/dia-textbook.pdf")
    print("✅ Ingestion complete!")

# -------- CHATBOT ROUTER --------
app.include_router(router, prefix="/chat", tags=["Chatbot"])


# =============================
# PREDICTION + DIET SECTION
# =============================

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


def explain_prediction_simple(user: dict) -> str:
    reasons = []

    if user["HbA1c_level"] >= 6.5:
        reasons.append("your long-term blood sugar (HbA1c) is high")

    if user["blood_glucose_level"] >= 126:
        reasons.append("your blood sugar level is above normal")

    if user["bmi"] >= 25:
        reasons.append("body weight may be affecting insulin")

    if user["hypertension"] == 1:
        reasons.append("high blood pressure is linked to diabetes")

    if user["smoking_history"].lower() in ["current", "former"]:
        reasons.append("smoking increases diabetes risk")

    explanation = (
        "You may be at risk of diabetes because "
        + ", and ".join(reasons)
        + "."
        if reasons
        else "Your result is based on multiple health factors."
    )

    explanation += (
        " Following a healthy diet, regular exercise, and lifestyle changes "
        "can help improve blood sugar control."
    )

    return explanation


# -------- SINGLE ML + DIET ENDPOINT --------
@app.post("/predict_and_diet", tags=["Prediction & Diet"])
def predict_and_diet(data: PatientInput):
    try:
        df = prepare_input_row(data.dict())
        prediction = int(model.predict(df)[0])

        diet_plan = get_diet_plan(data.dict())

        response = {
            "prediction": prediction,
            "message": "Diabetes Detected" if prediction == 1 else "No Diabetes",
            "diet_plan": diet_plan
        }

        if prediction == 1:
            response["why_this_result"] = explain_prediction_simple(data.dict())

        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -------- HEALTH CHECK --------
@app.get("/")
def home():
    return {"message": "Dia Assist API is running "}
