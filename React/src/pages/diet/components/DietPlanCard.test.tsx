import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DietPlanCard from "./DietPlanCard";
import type { DietPlan } from "./DietPlanCard";


/* ======================
   MOCK ICONS (lucide-react)
====================== */
vi.mock("lucide-react", () => ({
  CheckCircle2: () => <span>✔</span>,
  Flame: () => <span>🔥</span>,
}));

/* ======================
   MOCK DATA
====================== */
const mockPlan: DietPlan = {
  id: "plan-1",
  name: "Low Carb Diet",
  description: "Helps control blood sugar levels",
  category: "low-carb",
  totalCalories: 1800,
  meals: [
    {
      name: "Breakfast",
      time: "8:00 AM",
      calories: 400,
      foods: ["Eggs", "Avocado"],
    },
    {
      name: "Lunch",
      time: "1:00 PM",
      calories: 600,
      foods: ["Grilled Chicken", "Salad"],
    },
  ],
  benefits: [
    "Improves insulin sensitivity",
    "Supports weight management",
  ],
};

describe("DietPlanCard Component", () => {
  /* ======================
     BASIC RENDER
  ====================== */
  it("renders diet plan title, description, and calories", () => {
    render(<DietPlanCard plan={mockPlan} />);

    expect(
      screen.getByText("Low Carb Diet")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Helps control blood sugar levels")
    ).toBeInTheDocument();

    expect(
      screen.getByText("1800 kcal/day")
    ).toBeInTheDocument();
  });

  /* ======================
     CATEGORY BADGE
  ====================== */
  it("renders category label correctly", () => {
    render(<DietPlanCard plan={mockPlan} />);

    expect(
      screen.getByText("Low Carb")
    ).toBeInTheDocument();
  });

  /* ======================
     MEALS RENDERING
  ====================== */
  it("renders all meals with name, time, calories, and foods", () => {
    render(<DietPlanCard plan={mockPlan} />);

    // Meal names
    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();

    // Times
    expect(screen.getByText("(8:00 AM)")).toBeInTheDocument();
    expect(screen.getByText("(1:00 PM)")).toBeInTheDocument();

    // Calories
    expect(screen.getByText("400 kcal")).toBeInTheDocument();
    expect(screen.getByText("600 kcal")).toBeInTheDocument();

    // Foods
    expect(screen.getByText("Eggs")).toBeInTheDocument();
    expect(screen.getByText("Avocado")).toBeInTheDocument();
    expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
    expect(screen.getByText("Salad")).toBeInTheDocument();
  });

  /* ======================
     BENEFITS
  ====================== */
  it("renders all benefits", () => {
    render(<DietPlanCard plan={mockPlan} />);

    expect(
      screen.getByText("Improves insulin sensitivity")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Supports weight management")
    ).toBeInTheDocument();
  });
});
