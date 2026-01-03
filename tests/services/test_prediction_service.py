import numpy as np
from app.services.prediction_service import predict_diabetes


class DummyModel:
    def predict(self, X):
        return np.array([1])  # Always predict diabetes


def test_predict_diabetes_returns_positive(monkeypatch):
    # Arrange: mock the ML model
    from app.models import model_loader
    monkeypatch.setattr(model_loader, "ml_model", DummyModel())

    input_data = {
        "age": 45,
        "gender": "male",
        "hypertension": 1,
        "heart_disease": 0,
        "smoking_history": "current",
        "bmi": 28.0,
        "HbA1c_level": 7.0,
        "blood_glucose_level": 150
    }

    # Act
    result = predict_diabetes(type("obj", (), {"dict": lambda self=None: input_data})())

    # Assert
    assert result["prediction"] == 1
    assert "Diabetes Detected" in result["message"]
    assert "why_this_result" in result
