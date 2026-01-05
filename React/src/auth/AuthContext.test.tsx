import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider, AuthContext } from "./AuthContext";
import type { ReactNode } from "react";
import api from "@/api/axiosConfig";

/* ======================
   MOCK AXIOS INSTANCE
====================== */
vi.mock("@/api/axiosConfig", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

/* ======================
   TEST CONSUMER
====================== */
const TestConsumer = () => {
  return (
    <AuthContext.Consumer>
      {(value) => (
        <>
          <div>loading: {value.loading ? "true" : "false"}</div>
          <div>authenticated: {value.isAuthenticated ? "true" : "false"}</div>
          <div>user: {value.user?.email ?? "null"}</div>
          <button onClick={value.logout}>Logout</button>
        </>
      )}
    </AuthContext.Consumer>
  );
};

/* ======================
   TEST WRAPPER
====================== */
const renderWithProvider = (ui: ReactNode) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     INITIAL LOADING STATE
  ====================== */
  it("shows loading initially", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { email: "test@example.com", name: "Test" },
    });

    renderWithProvider(<TestConsumer />);

    expect(screen.getByText("loading: true")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("loading: false")).toBeInTheDocument()
    );
  });

  /* ======================
     AUTH SUCCESS
  ====================== */
  it("sets user and authenticated state when auth check succeeds", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: { email: "user@test.com", name: "User" },
    });

    renderWithProvider(<TestConsumer />);

    await waitFor(() =>
      expect(screen.getByText("authenticated: true")).toBeInTheDocument()
    );

    expect(screen.getByText("user: user@test.com")).toBeInTheDocument();
  });

  /* ======================
     AUTH FAILURE (401)
  ====================== */
  it("sets unauthenticated when auth check fails with 401", async () => {
    (api.get as any).mockRejectedValueOnce({
      response: { status: 401 },
    });

    renderWithProvider(<TestConsumer />);

    await waitFor(() =>
      expect(screen.getByText("authenticated: false")).toBeInTheDocument()
    );

    expect(screen.getByText("user: null")).toBeInTheDocument();
  });

  /* ======================
     LOGOUT
  ====================== */
  it("clears auth state on logout", async () => {
    // First: authenticated user
    (api.get as any).mockResolvedValueOnce({
      data: { email: "logout@test.com", name: "Logout User" },
    });

    (api.post as any).mockResolvedValueOnce({});

    renderWithProvider(<TestConsumer />);

    await waitFor(() =>
      expect(screen.getByText("authenticated: true")).toBeInTheDocument()
    );

    // Click logout
    screen.getByText("Logout").click();

    await waitFor(() =>
      expect(screen.getByText("authenticated: false")).toBeInTheDocument()
    );

    expect(screen.getByText("user: null")).toBeInTheDocument();
  });
});
