import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Predict from "./predictform";
import api from "@/api/axiosConfig";
import { BrowserRouter } from "react-router-dom";

/* ====================== MOCK API ====================== */
vi.mock("@/api/axiosConfig", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ====================== MOCK useNavigate ====================== */
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* ====================== MOCK ICONS ====================== */
vi.mock("lucide-react", () => ({
  Activity: () => <span>ActivityIcon</span>,
}));

/* ====================== MOCK localStorage ====================== */
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
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
});

/* ====================== TESTS ====================== */
describe("Predict Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });

  it("renders prediction form", () => {
    render(
      <BrowserRouter>
        <Predict />
      </BrowserRouter>
    );

    expect(
      screen.getByText("Diabetes Risk Prediction")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /get prediction/i })
    ).toBeInTheDocument();
  });

  it("shows validation error when required fields are missing", async () => {
    render(
      <BrowserRouter>
        <Predict />
      </BrowserRouter>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /get prediction/i })
    );

    // ✅ FIX: match rendered validation error reliably
    expect(
      await screen.findByText(/Age is required/i)
    ).toBeInTheDocument();
  });

  it("submits form and shows prediction result", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: {
        prediction: 1,
        message: "High risk detected",
        why_this_result: "High glucose and HbA1c levels",
      },
    });

    render(
      <BrowserRouter>
        <Predict />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Gender :"), {
      target: { value: "Male" },
    });
    fireEvent.change(screen.getByLabelText("Age :"), {
      target: { value: "45" },
    });
    fireEvent.change(screen.getByLabelText("HBA1C (%) :"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByLabelText("Glucose Level (mg/dL) :"), {
      target: { value: "180" },
    });
    fireEvent.change(screen.getByLabelText("BMI :"), {
      target: { value: "28" },
    });

    const yesButtons = screen.getAllByRole("button", { name: "Yes" });
    const noButtons = screen.getAllByRole("button", { name: "No" });

    fireEvent.click(yesButtons[0]); // smoking
    fireEvent.click(yesButtons[1]); // heart disease
    fireEvent.click(noButtons[2]);  // hypertension

    fireEvent.click(
      screen.getByRole("button", { name: /get prediction/i })
    );

    expect(await screen.findByText("🔴 Diabetic")).toBeInTheDocument();
    expect(screen.getByText(/High risk detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Why this result\?/i)).toBeInTheDocument();
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it("navigates to diet page when View Diet Plans is clicked", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: { prediction: 0, message: "Low risk" },
    });

    render(
      <BrowserRouter>
        <Predict />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Gender :"), {
      target: { value: "Female" },
    });
    fireEvent.change(screen.getByLabelText("Age :"), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText("HBA1C (%) :"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Glucose Level (mg/dL) :"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("BMI :"), {
      target: { value: "22" },
    });

    const noButtons = screen.getAllByRole("button", { name: "No" });
    fireEvent.click(noButtons[0]);
    fireEvent.click(noButtons[1]);
    fireEvent.click(noButtons[2]);

    fireEvent.click(
      screen.getByRole("button", { name: /get prediction/i })
    );

    await waitFor(() =>
      expect(screen.getByText("View Diet Plans")).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("View Diet Plans"));
    expect(mockNavigate).toHaveBeenCalledWith("/diet");
  });

  it("shows error message when API call fails", async () => {
    (api.post as any).mockRejectedValueOnce({
      message: "Network Error",
    });

    render(
      <BrowserRouter>
        <Predict />
      </BrowserRouter>
    );

    // ✅ Fill ALL required fields so API is called
    fireEvent.change(screen.getByLabelText("Gender :"), {
      target: { value: "Male" },
    });
    fireEvent.change(screen.getByLabelText("Age :"), {
      target: { value: "40" },
    });
    fireEvent.change(screen.getByLabelText("HBA1C (%) :"), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByLabelText("Glucose Level (mg/dL) :"), {
      target: { value: "150" },
    });
    fireEvent.change(screen.getByLabelText("BMI :"), {
      target: { value: "26" },
    });

    const yesButtons = screen.getAllByRole("button", { name: "Yes" });
    fireEvent.click(yesButtons[0]);
    fireEvent.click(yesButtons[1]);
    fireEvent.click(yesButtons[2]);

    fireEvent.click(
      screen.getByRole("button", { name: /get prediction/i })
    );

    expect(
      await screen.findByText(/Prediction failed:/i)
    ).toBeInTheDocument();
  });
});

