import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "./Dashboard";
import api from "@/api/axiosConfig";
import { BrowserRouter } from "react-router-dom";

/* ======================
   MOCK API
====================== */   
vi.mock("@/api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
  },
}));

/* ======================
   MOCK useNavigate
====================== */
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* ======================
   MOCK CHILD COMPONENTS
====================== */
vi.mock("./StatsCard", () => ({
  default: ({ title, value }: any) => (
    <div>
      <span>{title}</span>
      <span>{value}</span>
    </div>
  ),
}));

vi.mock("./WeeklyChart", () => ({
  default: () => <div>WeeklyChart</div>,
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     BASIC RENDER
  ====================== */
  it("renders dashboard headings", () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(/Track your health metrics/i)
    ).toBeInTheDocument();
  });

  /* ======================
     LOADING STATE
  ====================== */
  it("shows placeholder values while loading", async () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Initial placeholders
    expect(screen.getAllByText("--").length).toBeGreaterThan(0);

    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/prediction/history")
    );
  });

  /* ======================
     DATA RENDERING
  ====================== */
  it("renders latest stats from API response", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [
        {
          date: "2024-01-01",
          blood_glucose_level: 110,
          hba1c: 6.2,
        },
        {
          date: "2024-02-01",
          bloodGlucose: 95,
          HbA1c_level: 5.9,
        },
      ],
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("HBA1C Level")).toBeInTheDocument();
      expect(screen.getByText("5.9")).toBeInTheDocument();
      expect(screen.getByText("95 mg/dL")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // total assessments
    });
  });

  /* ======================
     WEEKLY CHART
  ====================== */
  it("renders WeeklyChart component", async () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(await screen.findByText("WeeklyChart")).toBeInTheDocument();
  });

  /* ======================
     QUICK ACTIONS
  ====================== */
  it("navigates to correct routes on button clicks", async () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/New Prediction/i));
    expect(mockNavigate).toHaveBeenCalledWith("/predict");

    fireEvent.click(screen.getByText(/View Diet Plans/i));
    expect(mockNavigate).toHaveBeenCalledWith("/diet");

    fireEvent.click(screen.getByText(/View History/i));
    expect(mockNavigate).toHaveBeenCalledWith("/history");
  });
});
