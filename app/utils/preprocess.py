

import pandas as pd

from app.models.model_loader import FEATURE_NAMES


def prepare_input_row(raw: dict) -> pd.DataFrame:   #Convert full user input into a clean, ML-ready DataFrame
   
    model_features = { #defined allowed features for the model
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

    df = pd.DataFrame([filtered]) #Single-row DataFrame

    # Convert numeric fields
    numeric_cols = ["age", "bmi", "HbA1c_level", "blood_glucose_level", "hypertension", "heart_disease"]
    for c in numeric_cols:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")#Convert to numeric, set invalid parsing as NaN

    df_dummies = pd.get_dummies(df, drop_first=False) #Convert categorical to numerical (one-hot encoding)

    # Ensure model feature order
    if FEATURE_NAMES:
        df_dummies = df_dummies.reindex(columns=FEATURE_NAMES, fill_value=0)#Reorder columns to match model's expected input, fill missing columns with 0

    return df_dummies.astype(float)
