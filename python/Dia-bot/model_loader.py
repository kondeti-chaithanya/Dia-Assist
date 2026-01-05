import joblib
import pandas as pd
import numpy as np
from typing import List, Optional

MODEL_PATH = "models/xgboost_diabetes.pkl"

def load_model():
    model = joblib.load(MODEL_PATH)
    feature_names = None   # When the model was trained using a DataFrame, sklearn stores the exact feature names and order
    if hasattr(model, "feature_names_in_"):
        feature_names = list(model.feature_names_in_)
    return model, feature_names

model, FEATURE_NAMES = load_model()

def prepare_input_row(raw: dict) -> pd.DataFrame:   #Convert full user input into a clean, ML-ready DataFrame
    """
    Accepts full user input
    Uses ONLY model-related fields
    """

   
    model_features = {
        "age",
        "gender",
        "hypertension",
        "heart_disease",
        "smoking_history",
        "bmi",
        "HbA1c_level",
        "blood_glucose_level"
    }

    #  Remove unwanted fields (like lists)
    filtered = {k: v for k, v in raw.items() if k in model_features}

    df = pd.DataFrame([filtered])

    # Convert numeric fields
    numeric_cols = ["age", "bmi", "HbA1c_level", "blood_glucose_level", "hypertension", "heart_disease"]
    for c in numeric_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")

    df_dummies = pd.get_dummies(df, drop_first=False)

    # Ensure model feature order
    if FEATURE_NAMES:
        df_dummies = df_dummies.reindex(columns=FEATURE_NAMES, fill_value=0)

    return df_dummies.astype(float)
