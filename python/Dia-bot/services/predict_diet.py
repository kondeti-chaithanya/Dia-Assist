from typing import Dict, List



# =========================
# PREDICTION EXPLANATION
# =========================

def explain_prediction_simple(user: Dict) -> str:
    reasons: List[str] = []

    if user.get("HbA1c_level", 0) >= 6.5:
        reasons.append("your long-term blood sugar (HbA1c) is high")

    if user.get("blood_glucose_level", 0) >= 126:
        reasons.append("your blood sugar level is above normal")

    if user.get("bmi", 0) >= 25:
        reasons.append("body weight may be affecting insulin")

    if user.get("hypertension") == 1:
        reasons.append("high blood pressure is linked to diabetes")

    smoking = user.get("smoking_history", "").lower()
    if smoking in ["current", "former"]:
        reasons.append("smoking increases diabetes risk")

    if reasons:
        explanation = (
            "You may be at risk of diabetes because "
            + ", and ".join(reasons)
            + "."
        )
    else:
        explanation = "Your result is based on multiple health factors."

    explanation += (
        " Following a healthy diet, regular exercise, and lifestyle changes "
        "can help improve blood sugar control."
    )

    return explanation


# =========================
# AGE & CALORIE LOGIC
# =========================

def get_age_group(age: int) -> str:
    if age <= 9:
        return "child"
    elif age <= 17:
        return "adolescent"
    elif age <= 59:
        return "adult"
    return "senior"


def calculate_daily_calories(age: int, gender: str, bmi: float) -> int:
    gender = gender.lower()

    if age <= 9:
        return 1690

    if 10 <= age <= 17:
        return 2190 if gender == "male" else 2010

    if 18 <= age <= 59:
        calories = 2200 if gender == "male" else 1800
        if bmi >= 30:
            calories -= 300
        elif bmi >= 25:
            calories -= 200
        return calories

    return 1800 if gender == "male" else 1600


# =========================
# MACRO CALCULATION
# =========================

def calculate_macros(calories: int, age_group: str, diabetic: bool) -> Dict:
    if age_group in ["child", "adolescent"]:
        carb_pct, protein_pct = 0.55, 0.20
    elif age_group == "adult":
        carb_pct = 0.50 if diabetic else 0.55
        protein_pct = 0.20
    else:
        carb_pct, protein_pct = 0.50, 0.22

    fat_pct = 1 - (carb_pct + protein_pct)

    return {
        "carbs_g": int((calories * carb_pct) / 4),
        "protein_g": int((calories * protein_pct) / 4),
        "fat_g": int((calories * fat_pct) / 9),
    }


# =========================
# DIET PLAN GENERATION
# =========================

def get_diet_plan(user: Dict) -> Dict:
    age = user.get("age", 30)
    gender = user.get("gender", "male")
    bmi = user.get("bmi", 23.0)
    hba1c = user.get("HbA1c_level", 0)
    glucose = user.get("blood_glucose_level", 0)
    hypertension = user.get("hypertension", 0)
    heart_disease = user.get("heart_disease", 0)
    other_diseases = user.get("other_diseases", [])

    age_group = get_age_group(age)
    diabetic = hba1c >= 6.5 or glucose >= 126

    calories = calculate_daily_calories(age, gender, bmi)
    macros = calculate_macros(calories, age_group, diabetic)

    carbs_meal = int(macros["carbs_g"] / 3)
    protein_meal = int(macros["protein_g"] / 3)

    meal_plan = {
        "breakfast": {
            "veg": [
                {"food": "Ragi / oats porridge", "quantity_g": carbs_meal},
                {"food": "Milk / paneer", "quantity_g": protein_meal},
            ],
            "non_veg": [
                {"food": "Boiled egg", "quantity_g": protein_meal}
            ],
        },
        "lunch": {
            "veg": [
                {"food": "Rice / millet", "quantity_g": carbs_meal},
                {"food": "Dal / rajma", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150},
            ],
            "non_veg": [
                {"food": "Rice / millet", "quantity_g": carbs_meal},
                {"food": "Fish / chicken", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150},
            ],
        },
        "dinner": {
            "veg": [
                {"food": "Roti", "quantity_g": carbs_meal},
                {"food": "Paneer / tofu", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150},
            ],
            "non_veg": [
                {"food": "Roti", "quantity_g": carbs_meal},
                {"food": "Fish / chicken", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150},
            ],
        },
    }

    notes = {}

    if age_group == "child":
        notes["child"] = "Growth-focused diet. Avoid calorie restriction."

    if age_group == "senior":
        notes["senior"] = "Easy-to-digest foods. Adequate protein and fiber."

    if diabetic:
        notes["diabetes"] = "Prefer low GI foods. Avoid sugar and refined carbs."

    if hypertension:
        notes["hypertension"] = "Salt intake should be less than 3g per day."

    if heart_disease:
        notes["heart_disease"] = "Low-fat diet. Avoid fried and processed foods."

    if other_diseases:
        notes["other_diseases"] = (
            "User has other medical conditions ("
            + ", ".join(other_diseases)
            + "). Please consult a qualified doctor or dietitian."
        )

    return {
        "age_group": age_group,
        "daily_calories": calories,
        "macros": macros,
        "meal_plan": meal_plan,
        "notes": notes,
        "source": "ICMR & NIN Dietary Guidelines (India)",
    }
