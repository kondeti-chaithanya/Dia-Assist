import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WeeklyChart from "./WeeklyChart";
import api from "@/api/axiosConfig";

/* ======================
   MOCK API
====================== */
vi.mock("@/api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
  },
}));

/* ======================
   MOCK RECHARTS
   (IMPORTANT: prevents DOM/canvas crashes)
====================== */
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div>Line</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
  CartesianGrid: () => <div>Grid</div>,
}));

describe("WeeklyChart Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     LOADING STATE
  ====================== */
  it("shows loading message initially", () => {
    (api.get as any).mockResolvedValueOnce({ data: [] });

    render(<WeeklyChart />);

    expect(
      screen.getByText("Loading chart...")
    ).toBeInTheDocument();
  });

  /* ======================
     EMPTY DATA
  ====================== */
  it("shows no data message when API returns empty array", async () => {
  (api.get as any).mockResolvedValueOnce({
    data: [],
  });

  render(<WeeklyChart />);

  expect(
    await screen.findByText((text) =>
      text.includes("No checkup data available")
    )
  ).toBeInTheDocument();
});

  /* ======================
     SUCCESS DATA RENDER
  ====================== */
  it("renders chart when valid data is returned", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [
        {
          check: "Week 1",
          hba1c: 6.2,
          glucose: 110,
        },
        {
          check: "Week 2",
          hba1c: 6,
          glucose: 105,
        },
      ],
    });

    render(<WeeklyChart />);

    await waitFor(() => {
      expect(screen.getByText("XAxis")).toBeInTheDocument();
      expect(screen.getByText("YAxis")).toBeInTheDocument();
      expect(screen.getAllByText("Line").length).toBeGreaterThan(0);
    });
  });

  /* ======================
     API ERROR HANDLING
  ====================== */
  it("shows error message when API fails", async () => {
    (api.get as any).mockRejectedValueOnce({
      response: { status: 500 },
    });

    render(<WeeklyChart />);

    await waitFor(() =>
      expect(
        screen.getByText(/failed to load graph data/i)
      ).toBeInTheDocument()
    );
  });

  /* ======================
     UNAUTHORIZED ERROR
  ====================== */
  it("shows unauthorized message on 401 error", async () => {
    (api.get as any).mockRejectedValueOnce({
      response: { status: 401 },
    });

    render(<WeeklyChart />);

    await waitFor(() =>
      expect(
        screen.getByText(/unauthorized/i)
      ).toBeInTheDocument()
    );
  });
});
