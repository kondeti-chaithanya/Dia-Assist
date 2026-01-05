import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Works from "./Works";

/* ======================
   MOCK ICONS (lucide-react)
====================== */
vi.mock("lucide-react", () => ({
  Activity: () => <span>ActivityIcon</span>,
  TrendingUp: () => <span>TrendingUpIcon</span>,
  Heart: () => <span>HeartIcon</span>,
  MessageSquare: () => <span>MessageSquareIcon</span>,
}));

describe("Works Component", () => {
  it("renders section heading and subtitle", () => {
    render(<Works />);

    expect(
      screen.getByText("How Dia Assist Works")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Our AI-powered platform makes diabetes prevention simple/i
      )
    ).toBeInTheDocument();
  });

  it("renders all step numbers", () => {
    render(<Works />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("renders all step titles", () => {
    render(<Works />);

    expect(screen.getByText("Enter Your Data")).toBeInTheDocument();
    expect(screen.getByText("Get Prediction")).toBeInTheDocument();
    expect(screen.getByText("Receive Plan")).toBeInTheDocument();
    expect(screen.getByText("Stay Connected")).toBeInTheDocument();
  });

  it("renders all step descriptions", () => {
    render(<Works />);

    expect(
      screen.getByText(/Input your health parameters/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Our ML model analyzes your data/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/personalized diet and lifestyle recommendations/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Track your progress and get assistance/i)
    ).toBeInTheDocument();
  });

  it("renders all icons", () => {
    render(<Works />);

    expect(screen.getByText("ActivityIcon")).toBeInTheDocument();
    expect(screen.getByText("TrendingUpIcon")).toBeInTheDocument();
    expect(screen.getByText("HeartIcon")).toBeInTheDocument();
    expect(screen.getByText("MessageSquareIcon")).toBeInTheDocument();
  });
});
