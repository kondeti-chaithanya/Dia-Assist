import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InfoCard from "./StatsCard";


describe("InfoCard Component", () => {
  it("renders title, value, description, and icon correctly", () => {
    render(
      <InfoCard
        title="Glucose Level"
        value="95 mg/dL"
        desc="Normal range"
        icon="💚"
      />
    );

    expect(
      screen.getByText("Glucose Level")
    ).toBeInTheDocument();

    expect(
      screen.getByText("95 mg/dL")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Normal range")
    ).toBeInTheDocument();

    expect(
      screen.getByText("💚")
    ).toBeInTheDocument();
  });

  it("supports numeric values", () => {
    render(
      <InfoCard
        title="Total Assessments"
        value={5}
        desc="Completed"
        icon="📊"
      />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
