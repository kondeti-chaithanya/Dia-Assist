import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./button";

describe("Button Component", () => {
  it("renders button with children", () => {
    render(<Button>Click Me</Button>);

    expect(
      screen.getByRole("button", { name: "Click Me" })
    ).toBeInTheDocument();
  });

  it("applies default variant and size classes", () => {
    render(<Button>Default</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("bg-teal-500");
    expect(button.className).toContain("px-6");
  });

  it("applies hero variant", () => {
    render(<Button variant="hero">Hero</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("bg-primary");
  });

  it("applies outline variant", () => {
    render(<Button variant="outline">Outline</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("border-2");
  });

  it("applies size lg", () => {
    render(<Button size="lg">Large</Button>);

    const button = screen.getByRole("button");

    expect(button.className).toContain("px-8");
    expect(button.className).toContain("py-4");
  });

  it("passes through additional props", () => {
    const onClick = vi.fn();

    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges custom className correctly", () => {
    render(
      <Button className="custom-class">
        Custom
      </Button>
    );

    const button = screen.getByRole("button");

    expect(button.className).toContain("custom-class");
  });
});
