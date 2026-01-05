import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AuthContext } from "@/auth/AuthContext";

/* ======================
   MOCK PAGE COMPONENTS
====================== */
vi.mock("@/pages/home", () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock("@/pages/dashboard/components/Dashboard", () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock("@/pages/predict/components/predictform", () => ({
  default: () => <div>Predict Page</div>,
}));

vi.mock("@/pages/diet/components/Diet", () => ({
  default: () => <div>Diet Page</div>,
}));

vi.mock("@/pages/history/components/History", () => ({
  default: () => <div>History Page</div>,
}));

vi.mock("@/global/components/Chat bot/components/Chatbot", () => ({
  default: ({ isFullPage }: any) => (
    <div>{isFullPage ? "Chatbot Full Page" : "Chatbot Widget"}</div>
  ),
}));

/* ======================
   MOCK ProtectedRoute
====================== */
vi.mock("@/auth/ProtectedRoute", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

/* ======================
   RENDER HELPER
====================== */
const renderWithAuth = (
  initialRoute: string,
  isAuthenticated = true
) => {
  render(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: null,
        loading: false,
        error: null,
        setIsAuthenticated: () => {},
        setUser: () => {},
        setError: () => {},
        logout: async () => {},
        clearError: () => {},
      }}
    >
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("AppRoutes", () => {
  /* ======================
     PUBLIC ROUTE
  ====================== */
  it("renders Home page at /", () => {
    renderWithAuth("/");

    expect(
      screen.getByText("Home Page")
    ).toBeInTheDocument();
  });

  /* ======================
     PROTECTED ROUTES
  ====================== */
  it("renders Dashboard with Chatbot for authenticated user", () => {
    renderWithAuth("/dashboard", true);

    expect(
      screen.getByText("Dashboard Page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Chatbot Widget")
    ).toBeInTheDocument();
  });

  it("renders Predict page with Chatbot", () => {
    renderWithAuth("/predict", true);

    expect(
      screen.getByText("Predict Page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Chatbot Widget")
    ).toBeInTheDocument();
  });

  it("renders Diet page with Chatbot", () => {
    renderWithAuth("/diet", true);

    expect(
      screen.getByText("Diet Page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Chatbot Widget")
    ).toBeInTheDocument();
  });

  it("renders History page with Chatbot", () => {
    renderWithAuth("/history", true);

    expect(
      screen.getByText("History Page")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Chatbot Widget")
    ).toBeInTheDocument();
  });

  /* ======================
     CHATBOT FULL PAGE ROUTE
  ====================== */
  it("renders full-page chatbot at /chatbot", () => {
    renderWithAuth("/chatbot", true);

    expect(
      screen.getByText("Chatbot Full Page")
    ).toBeInTheDocument();
  });
});
