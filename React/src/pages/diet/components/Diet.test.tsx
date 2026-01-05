import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Diet from "./Diet";

/* ======================
   MOCK DietPlanCard
====================== */
vi.mock("./DietPlanCard", () => ({
  default: ({ plan, isRecommended }: any) => (
    <div>
      <span>{plan?.title}</span>
      {isRecommended && <span>Recommended</span>}
    </div>
  ),
}));

/* ======================
   MOCK mapBackendDietToUI
====================== */
vi.mock("@/util/mapDietPlan", () => ({
  mapBackendDietToUI: vi.fn(),
}));

import { mapBackendDietToUI } from "@/util/mapDietPlan";

/* ======================
   MOCK localStorage
====================== */
/* ======================
   MOCK localStorage
====================== */
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
});
/* ======================
   TESTS
====================== */
describe("Diet Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });


  it("renders diet plans when prediction data exists", async () => {
    mockLocalStorage.getItem.mockReturnValueOnce(
      JSON.stringify({
        prediction: 1,
        diet_plan: { backend: "data" },
      })
    );

    (mapBackendDietToUI as any).mockReturnValueOnce({
      vegPlan: { title: "Vegetarian Diet" },
      nonVegPlan: { title: "Non-Vegetarian Diet" },
    });

    render(<Diet />);

    expect(
      await screen.findByText("Personalized Diet Plans")
    ).toBeInTheDocument();

    expect(screen.getByText("Vegetarian Diet")).toBeInTheDocument();
    expect(screen.getByText("Recommended")).toBeInTheDocument();
    expect(screen.getByText("Non-Vegetarian Diet")).toBeInTheDocument();
  });

  it("shows message when no prediction is found", async () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    render(<Diet />);

    expect(
      await screen.findByText(
        "No prediction found. Please generate a prediction first."
      )
    ).toBeInTheDocument();
  });

  it("renders nutrition tips section", async () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    render(<Diet />);

    expect(
      await screen.findByText(
        "General Nutrition Tips for Diabetes Prevention"
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Choose Complex Carbs")).toBeInTheDocument();
    expect(screen.getByText("Stay Hydrated")).toBeInTheDocument();
  });
});
