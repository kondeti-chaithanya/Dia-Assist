import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import History from "./History";
import api from "@/api/axiosConfig";

/* ======================
   MOCK API
====================== */
vi.mock("@/api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("History Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     LOADING STATE
  ====================== */
  it("shows loading message initially", () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });

    render(<History />);

    expect(
      screen.getByText("Loading history...")
    ).toBeInTheDocument();
  });

  /* ======================
     EMPTY HISTORY
  ====================== */
  it("shows no history message when API returns empty data", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [],
    });

    render(<History />);

    await waitFor(() =>
      expect(
        screen.getByText(
          "No history found. Make a prediction to start tracking!"
        )
      ).toBeInTheDocument()
    );
  });

  /* ======================
     SUCCESS DATA RENDER
  ====================== */
  it("renders history table with mapped values", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [
        {
          date: "2024-01-01T10:30:00",
          result: "1",
          blood_glucose_level: 140,
          bmi: 27.5,
          HbA1c_level: 6.8,
        },
        {
          date: "2024-02-01T12:15:00",
          result: "0",
          bloodGlucose: 95,
          bmi: 22.1,
          hba1c: 5.4,
        },
      ],
    });

    render(<History />);

    await waitFor(() => {
      expect(
        screen.getByText("Prediction History")
      ).toBeInTheDocument();
    });

    // Risk labels
    expect(screen.getByText("Diabetic")).toBeInTheDocument();
    expect(screen.getByText("Non-Diabetic")).toBeInTheDocument();

    // Values
    expect(screen.getByText("140")).toBeInTheDocument();
    expect(screen.getByText("27.5")).toBeInTheDocument();
    expect(screen.getByText("6.8")).toBeInTheDocument();

    expect(screen.getByText("95")).toBeInTheDocument();
    expect(screen.getByText("22.1")).toBeInTheDocument();
    expect(screen.getByText("5.4")).toBeInTheDocument();
  });

  /* ======================
     ERROR STATE
  ====================== */
  it("shows error message when API call fails", async () => {
    (api.get as any).mockRejectedValueOnce({
      response: {
        data: { message: "Server error" },
        status: 500,
      },
      message: "Request failed",
    });

    render(<History />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load history/i)
      ).toBeInTheDocument()
    );
  });
});
