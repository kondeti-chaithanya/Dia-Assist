from app.models.model_loader import ml_model
from app.utils.preprocess import prepare_input_row
from app.models.schemas import PatientInput
from app.utils.explanation import explain_prediction_simple

def predict_diabetes(data: PatientInput):
   
        # ---- ML Prediction ----
        df = prepare_input_row(data.dict())
        prediction = int(ml_model.predict(df)[0])


        # ---- Base Response ----
        response = {
            "prediction": prediction,
            "message": "Diabetes Detected" if prediction == 1 else "No Diabetes",
        }

        # Explanation ONLY for diabetic users
        if prediction == 1:
            response["why_this_result"] = explain_prediction_simple(data.dict())

        return response