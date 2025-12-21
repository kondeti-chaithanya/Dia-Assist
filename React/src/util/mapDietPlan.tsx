export const mapBackendDietToUI = (dietPlan: any) => {
  if (!dietPlan || !dietPlan.meal_plan) return null;

  const caloriesPerMeal = Math.round(
    (dietPlan.daily_calories || 0) / 3
  );

  const createMeals = (type: "veg" | "non_veg") => [
    {
      name: "Breakfast",
      time: "8:00 AM",
      calories: caloriesPerMeal,
      foods:
        dietPlan.meal_plan?.breakfast?.[type]?.map(
          (f: any) => `${f.food} (${f.quantity_g}g)`
        ) || [],
    },
    {
      name: "Lunch",
      time: "1:00 PM",
      calories: caloriesPerMeal,
      foods:
        dietPlan.meal_plan?.lunch?.[type]?.map(
          (f: any) => `${f.food} (${f.quantity_g}g)`
        ) || [],
    },
    {
      name: "Dinner",
      time: "8:00 PM",
      calories: caloriesPerMeal,
      foods:
        dietPlan.meal_plan?.dinner?.[type]?.map(
          (f: any) => `${f.food} (${f.quantity_g}g)`
        ) || [],
    },
  ];

  return {
    vegPlan: {
      id: "veg",
      name: "Vegetarian Diet Plan",
      description:
        dietPlan.notes?.diabetes ??
        "Balanced vegetarian diet for blood sugar control.",
      category: "vegetarian",
      totalCalories: dietPlan.daily_calories || 0,
      meals: createMeals("veg"),
      benefits: [
        "Improves insulin sensitivity",
        "High fiber & low GI foods",
        "Heart friendly diet",
      ],
    },

    nonVegPlan: {
      id: "non-veg",
      name: "Non-Vegetarian Diet Plan",
      description:
        dietPlan.notes?.diabetes ??
        "Protein-rich diet for stable glucose levels.",
      category: "balanced",
      totalCalories: dietPlan.daily_calories || 0,
      meals: createMeals("non_veg"),
      benefits: [
        "High quality protein intake",
        "Supports muscle metabolism",
        "Keeps blood sugar stable",
      ],
    },
  };
};
