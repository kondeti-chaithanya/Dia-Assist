import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "./Login";
import api from "../../../api/axiosConfig";
import { AuthContext } from "../../../auth/AuthContext";

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
const renderLogin = ({
  onSuccess = vi.fn(),
  switchToRegister = vi.fn(),
}: {
  onSuccess?: () => void;
  switchToRegister?: () => void;
} = {}) => {
  const setIsAuthenticated = vi.fn();
  const setUser = vi.fn();
  const setError = vi.fn();

  render(
    <AuthContext.Provider
      value={{
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        setIsAuthenticated,
        setUser,
        setError,
        logout: async () => {},
        clearError: () => {},
      }}
    >
      <Login
        onSuccess={onSuccess}
        switchToRegister={switchToRegister}
      />
    </AuthContext.Provider>
  );

  return { setIsAuthenticated, setUser, setError };
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     BASIC RENDER
  ====================== */
  it("renders login form fields", () => {
    renderLogin();

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  /* ======================
     VALIDATION ERRORS
  ====================== */
  it("shows validation errors when submitting empty form", async () => {
    renderLogin();

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Email is required")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password is required")
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "invalid-email" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  /* ======================
     SUCCESSFUL LOGIN
  ====================== */
  it("logs in successfully and updates auth context", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: {
        email: "user@test.com",
        name: "User",
      },
    });

    const onSuccess = vi.fn();
    const { setIsAuthenticated, setUser } = renderLogin({ onSuccess });

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "USER@test.com " },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(setIsAuthenticated).toHaveBeenCalledWith(true)
    );

    expect(setUser).toHaveBeenCalledWith({
      email: "user@test.com",
      name: "User",
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  /* ======================
     API ERROR HANDLING
  ====================== */
  it("shows error message on 401 response", async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { status: 401 },
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "user@test.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Incorrect email address or password"
    );
  });

  /* ======================
     PASSWORD VISIBILITY
  ====================== */
  it("toggles password visibility", () => {
    renderLogin();

    const passwordInput =
      screen.getByLabelText("Password") as HTMLInputElement;

    expect(passwordInput.type).toBe("password");

    fireEvent.click(
      screen.getByRole("button", { name: /show password/i })
    );

    expect(passwordInput.type).toBe("text");
  });

  /* ======================
     SWITCH TO REGISTER
  ====================== */
  it("calls switchToRegister when clicked", () => {
    const switchToRegister = vi.fn();
    renderLogin({ switchToRegister });

    fireEvent.click(screen.getByText("Create one"));

    expect(switchToRegister).toHaveBeenCalled();
  });
});
