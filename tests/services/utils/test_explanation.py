from app.utils.explanation import explain_prediction_simple

def test_explain_prediction_simple():
    # Test case 1: High HbA1c and blood glucose levels
    user1 = {
        "HbA1c_level": 7.0,
        "blood_glucose_level": 130,
        "bmi": 24,
        "hypertension": 0,
        "smoking_history": "never"
    }
    explanation1 = explain_prediction_simple(user1)
    assert "your long-term blood sugar level (HbA1c) is higher than normal" in explanation1
    assert "your blood sugar level is above the healthy range" in explanation1
    assert "Your result is based on a combination of health parameters." not in explanation1

    # Test case 2: High BMI and hypertension
    user2 = {
        "HbA1c_level": 5.5,
        "blood_glucose_level": 100,
        "bmi": 28,
        "hypertension": 1,
        "smoking_history": "never"
    }
    explanation2 = explain_prediction_simple(user2)
    assert "your body weight may be affecting how insulin works" in explanation2
    assert "high blood pressure is often linked with diabetes risk" in explanation2

    # Test case 3: Smoking history
    user3 = {
        "HbA1c_level": 5.0,
        "blood_glucose_level": 90,
        "bmi": 22,
        "hypertension": 0,
        "smoking_history": "current"
    }
    explanation3 = explain_prediction_simple(user3)
    assert "smoking can increase blood sugar-related problems" in explanation3

    # Test case 4: No risk factors
    user4 = {
        "HbA1c_level": 5.0,
        "blood_glucose_level": 90,
        "bmi": 22,
        "hypertension": 0,
        "smoking_history": "never"
    }
    explanation4 = explain_prediction_simple(user4)
    assert explanation4 == "Your result is based on a combination of health parameters. Following the recommended diet plan and healthy lifestyle habits may help improve blood sugar control and reduce future diabetes risk. "