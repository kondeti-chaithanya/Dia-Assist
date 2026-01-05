import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Modal from "./Modal";

describe("Modal Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(
      screen.queryByText("Modal Content")
    ).not.toBeInTheDocument();
  });

  it("renders modal content when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(
      screen.getByText("Modal Content")
    ).toBeInTheDocument();
  });

  it("calls onClose when clicking overlay", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(document.querySelector(".modal-overlay")!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onClose when clicking modal content", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(document.querySelector(".modal-content")!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText("✕"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
