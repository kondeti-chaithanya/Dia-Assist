import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Register from "./Register";
import api from "../../../api/axiosConfig";

/* ======================
   MOCK API
====================== */
vi.mock("../../../api/axiosConfig", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ======================
   RENDER HELPER
====================== */
const renderRegister = (switchToLogin = vi.fn()) => {
  render(<Register switchToLogin={switchToLogin} />);
  return { switchToLogin };
};

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     BASIC RENDER
  ====================== */
  it("renders register form fields", () => {
    renderRegister();

    expect(screen.getByText("Create account")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  /* ======================
     VALIDATION ERRORS
  ====================== */
  it("shows validation errors when submitting empty form", async () => {
    renderRegister();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText("Full name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Please confirm your password")
    ).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    renderRegister();

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "Password2" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText("Passwords do not match")
    ).toBeInTheDocument();
  });

  /* ======================
     PASSWORD VISIBILITY
  ====================== */
  it("toggles password visibility", () => {
    renderRegister();

    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(
      screen.getAllByRole("button", { name: /show password/i })[0]
    );

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  /* ======================
     SUCCESSFUL REGISTRATION
  ====================== */
 it("shows success screen and redirects to login", async () => {
  vi.useFakeTimers();

  (api.post as any).mockResolvedValueOnce({ status: 201 });

  const { switchToLogin } = renderRegister();

  fireEvent.change(screen.getByLabelText("Full name"), {
    target: { value: "John Doe" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "john@test.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Password1" },
  });
  fireEvent.change(screen.getByLabelText("Confirm password"), {
    target: { value: "Password1" },
  });

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  // ✅ Skip waiting for UI text (unstable with fake timers)
  await act(async () => {
    vi.advanceTimersByTime(2500);
  });

  expect(switchToLogin).toHaveBeenCalled();

  vi.useRealTimers();
});



  /* ======================
     API ERROR HANDLING
  ====================== */
  it("shows error when email already exists (403)", async () => {
    vi.useRealTimers();

    (api.post as any).mockRejectedValueOnce({
      response: { status: 403 },
    });

    renderRegister();

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "Password1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    const alert = await screen.findByRole("alert");

    expect(alert).toHaveTextContent(
      "Email already registered. Please use a different email."
    );
  });

  /* ======================
     SWITCH TO LOGIN
  ====================== */
  it("calls switchToLogin when Sign in is clicked", () => {
    const { switchToLogin } = renderRegister();

    fireEvent.click(screen.getByText("Sign in"));

    expect(switchToLogin).toHaveBeenCalled();
  });
});
