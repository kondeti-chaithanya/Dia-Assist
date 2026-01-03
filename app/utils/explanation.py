
def explain_prediction_simple(user: dict) -> str: #Generates simple explanation based on user data
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

    # Positive, reassuring guidance (VERY IMPORTANT)
    explanation += (
        " Following the recommended diet plan and healthy lifestyle habits "
        "may help improve blood sugar control and reduce future diabetes risk. "
    )

    return explanation