import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom does NOT implement this → mock it
Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true,
});
