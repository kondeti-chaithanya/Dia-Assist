
import pandas as pd
from app.utils.preprocess import prepare_input_row


def test_prepare_input_row_returns_dataframe():
    raw_input = {
        "age": 45,
        "gender": "male",
        "hypertension": 1,
        "heart_disease": 0,
        "smoking_history": "former",
        "bmi": 27.5,
        "HbA1c_level": 6.8,
        "blood_glucose_level": 140,
        "other_diseases": ["asthma"]  # should be ignored
    }

    df = prepare_input_row(raw_input)

    assert isinstance(df, pd.DataFrame)


def test_prepare_input_row_has_one_row():
    raw_input = {
        "age": 30,
        "gender": "female",
        "hypertension": 0,
        "heart_disease": 0,
        "smoking_history": "never",
        "bmi": 22.0,
        "HbA1c_level": 5.2,
        "blood_glucose_level": 95
    }

    df = prepare_input_row(raw_input)

    assert df.shape[0] == 1


def test_prepare_input_row_all_values_are_numeric():
    raw_input = {
        "age": 50,
        "gender": "male",
        "hypertension": 1,
        "heart_disease": 1,
        "smoking_history": "current",
        "bmi": 29.0,
        "HbA1c_level": 7.2,
        "blood_glucose_level": 160
    }

    df = prepare_input_row(raw_input)

    assert all(dtype.kind in "if" for dtype in df.dtypes)
