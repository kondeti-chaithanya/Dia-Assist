def get_age_group(age: int) -> str:
    if age <= 9:
        return "child"
    elif age <= 17:
        return "adolescent"
    elif age <= 59:
        return "adult"
    else:
        return "senior"


def calculate_daily_calories(age, gender, bmi):

    # -------- CHILDREN --------
    if age <= 9:
        return 1690

    # -------- ADOLESCENTS --------
    if 10 <= age <= 17:
        return 2190 if gender.lower() == "male" else 2010

    # -------- ADULTS --------
    if 18 <= age <= 59:
        base_cal = 2200 if gender.lower() == "male" else 1800

        if bmi >= 30:
            base_cal -= 300
        elif bmi >= 25:
            base_cal -= 200

        return base_cal

    # -------- SENIORS --------
    return 1800 if gender.lower() == "male" else 1600


def calculate_macros(calories, age_group, diabetic):
    """
    ICMR/NIN macro distribution
    """

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
        "fat_g": int((calories * fat_pct) / 9)
    }


def get_diet_plan(user: dict):
    age = user["age"]
    gender = user["gender"]
    bmi = user["bmi"]
    hba1c = user["HbA1c_level"]
    glucose = user["blood_glucose_level"]
    hypertension = user["hypertension"]
    heart_disease = user["heart_disease"]
    other_diseases = user.get("other_diseases", [])

    age_group = get_age_group(age)
    diabetic = hba1c >= 6.5 or glucose >= 126

    calories = calculate_daily_calories(age, gender, bmi)
    macros = calculate_macros(calories, age_group, diabetic)

    carbs_meal = int(macros["carbs_g"] / 3)
    protein_meal = int(macros["protein_g"] / 3)

    # ---------------- MEAL PLAN ----------------
    meal_plan = {
        "breakfast": {
            "veg": [
                {"food": "Ragi / oats porridge", "quantity_g": carbs_meal},
                {"food": "Milk / paneer", "quantity_g": protein_meal}
            ],
            "non_veg": [
                {"food": "Boiled egg", "quantity_g": protein_meal}
            ]
        },
        "lunch": {
            "veg": [
                {"food": "Rice / millet", "quantity_g": carbs_meal},
                {"food": "Dal / rajma", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150}
            ],
            "non_veg": [
                {"food": "Rice / millet", "quantity_g": carbs_meal},
                {"food": "Fish / chicken", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150}
            ]
        },
        "dinner": {
            "veg": [
                {"food": "Roti", "quantity_g": carbs_meal},
                {"food": "Paneer / tofu", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150}
            ],
            "non_veg": [
                {"food": "Roti", "quantity_g": carbs_meal},
                {"food": "Fish / chicken", "quantity_g": protein_meal},
                {"food": "Vegetables", "quantity_g": 150}
            ]
        }
    }

    # ---------------- NOTES ----------------
    notes = {}

    if age_group == "child":
        notes["child"] = "Growth-focused diet. Avoid calorie restriction."

    if age_group == "senior":
        notes["senior"] = "Easy-to-digest foods. Adequate protein & fiber."

    if diabetic:
        notes["diabetes"] = "Low GI foods. Avoid sugar & refined carbs."

    if hypertension:
        notes["hypertension"] = "Salt intake should be less than 3g/day."

    if heart_disease:
        notes["heart_disease"] = "Low-fat diet. Avoid fried and processed foods."

    if other_diseases:
        notes["other_diseases"] = (
            "User has other medical conditions ("
            + ", ".join(other_diseases)
            + "). Please consult a qualified doctor or dietitian for disease-specific dietary advice."
        )

    return {
        "age_group": age_group,
        "daily_calories": calories,
        "macros": macros,
        "meal_plan": meal_plan,
        "notes": notes,
        "source": "ICMR & NIN Dietary Guidelines (India)"
    }
