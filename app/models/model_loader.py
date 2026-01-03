import os
import joblib #Used to save and load ML models(pickle)
import pandas as pd #raw data to structure dataframe
import numpy as np #numerical operations
from typing import List, Optional #

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "artifacts", "xgboost_diabetes.pkl")

def load_model():
    model = joblib.load(MODEL_PATH)
    feature_names = None   # When the model was trained using a DataFrame, sklearn stores the exact feature names and order
    if hasattr(model, "feature_names_in_"):
        feature_names = list(model.feature_names_in_)
    return model, feature_names

ml_model, FEATURE_NAMES = load_model() #Load model and feature names only once(globally)
