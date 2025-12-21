import type { DietPlan } from "../pages/diet/components/DietPlanCard";

export const mockDietPlans: DietPlan[] = [
  {
    id: "diet-1",
    name: "Low Carb Weight Control",
    description:
      "A low-carbohydrate plan designed to stabilize blood sugar and promote fat loss.",
    category: "low-carb",
    totalCalories: 1800,
    meals: [
      {
        name: "Breakfast",
        time: "8:00 AM",
        calories: 400,
        foods: ["Boiled Eggs", "Avocado", "Green Tea"],
      },
      {
        name: "Lunch",
        time: "1:00 PM",
        calories: 550,
        foods: ["Grilled Chicken", "Steamed Broccoli", "Olive Oil Salad"],
      },
      {
        name: "Dinner",
        time: "7:00 PM",
        calories: 500,
        foods: ["Baked Salmon", "Cauliflower Rice", "Spinach"],
      },
    ],
    benefits: [
      "Helps reduce blood sugar spikes",
      "Supports healthy weight loss",
      "Improves insulin sensitivity",
    ],
  },

  {
    id: "diet-2",
    name: "Balanced Diabetes Friendly",
    description:
      "A well-balanced diet with controlled carbs, healthy fats, and lean proteins.",
    category: "balanced",
    totalCalories: 2000,
    meals: [
      {
        name: "Breakfast",
        time: "8:30 AM",
        calories: 450,
        foods: ["Oatmeal", "Blueberries", "Low-fat Milk"],
      },
      {
        name: "Lunch",
        time: "1:30 PM",
        calories: 600,
        foods: ["Brown Rice", "Grilled Fish", "Mixed Vegetables"],
      },
      {
        name: "Dinner",
        time: "7:30 PM",
        calories: 550,
        foods: ["Whole Wheat Roti", "Paneer Curry", "Salad"],
      },
    ],
    benefits: [
      "Maintains steady glucose levels",
      "Provides complete nutrition",
      "Boosts daily energy levels",
    ],
  },

  {
    id: "diet-3",
    name: "Vegetarian Wellness Plan",
    description:
      "Plant-based nutrition focused on fiber, antioxidants, and heart health.",
    category: "vegetarian",
    totalCalories: 1900,
    meals: [
      {
        name: "Breakfast",
        time: "9:00 AM",
        calories: 420,
        foods: ["Smoothie Bowl", "Chia Seeds", "Almond Milk"],
      },
      {
        name: "Lunch",
        time: "2:00 PM",
        calories: 580,
        foods: ["Quinoa", "Lentil Curry", "Cucumber Salad"],
      },
      {
        name: "Dinner",
        time: "8:00 PM",
        calories: 500,
        foods: ["Vegetable Stir Fry", "Tofu", "Brown Rice"],
      },
    ],
    benefits: [
      "Rich in fiber for better digestion",
      "Supports heart health",
      "Reduces inflammation naturally",
    ],
  },
];
