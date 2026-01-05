import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("renders footer text and logo", () => {
    render(<Footer />);

    // App name
    expect(
      screen.getByText("Dia Assist")
    ).toBeInTheDocument();

    // Copyright text
    expect(
      screen.getByText(
        /© 2026 Dia Assist. All rights reserved./i
      )
    ).toBeInTheDocument();
  });

  it("renders footer logo image", () => {
    render(<Footer />);

    const logo = screen.getByAltText("logo") as HTMLImageElement;

    expect(logo).toBeInTheDocument();
    expect(logo.src).toContain("/favicon.png");
  });
});
