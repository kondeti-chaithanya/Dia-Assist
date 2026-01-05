import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeroSection from "./HeroSection";
import { AuthContext } from "@/auth/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { act, waitFor } from "@testing-library/react";

/* ======================
   MOCK useNavigate
====================== */
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* ======================
   MOCK CHILD COMPONENTS
====================== */
vi.mock("./Works", () => ({
  default: () => <div>Works Component</div>,
}));

vi.mock("@/global/components/modal/components/Modal", () => ({
  default: ({ isOpen, children }: any) =>
    isOpen ? <div>{children}</div> : null,
}));

vi.mock("@/pages/auth/components/Login", () => ({
  default: () => <div>Login Component</div>,
}));

vi.mock("@/pages/auth/components/Register", () => ({
  default: () => <div>Register Component</div>,
}));

/* ======================
   RENDER HELPER
====================== */
const renderHero = (isAuthenticated = false) => {
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
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("HeroSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     BASIC RENDER
  ====================== */
  it("renders hero title and description", () => {
    renderHero();

    expect(
  screen.getByText((content, element) =>
    element?.tagName.toLowerCase() === "h1" &&
    content.includes("Your Personal") &&
    content.includes("Health Assistant")
  )
).toBeInTheDocument();

  });

  /* ======================
     FEATURES SECTION
  ====================== */
  it("renders feature cards", () => {
    renderHero();

    expect(screen.getByText("ML Prediction")).toBeInTheDocument();
    expect(screen.getByText("Health Tracking")).toBeInTheDocument();
    expect(screen.getByText("Diet Plans")).toBeInTheDocument();
  });

  /* ======================
     PROTECTED NAVIGATION (UNAUTH)
  ====================== */
it("opens login modal when openLoginModal event is fired", async () => {
  renderHero(false);

  await act(async () => {
    window.dispatchEvent(new Event("openLoginModal"));
  });

  await waitFor(() => {
    expect(
      screen.getByText("Login Component")
    ).toBeInTheDocument();
  });
});

  /* ======================
     PROTECTED NAVIGATION (AUTH)
  ====================== */
  it("navigates when authenticated user clicks buttons", () => {
    renderHero(true);

    fireEvent.click(screen.getByText("Check Your Risk"));
    expect(mockNavigate).toHaveBeenCalledWith("/predict");

    fireEvent.click(screen.getByText("View Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  /* ======================
   CHATBOT LOGIN EVENT
====================== */
it("opens login modal when openLoginModal event is fired", async () => {
  renderHero(false);

  await act(async () => {
    window.dispatchEvent(new Event("openLoginModal"));
  });

  await waitFor(() => {
    expect(
      screen.getByText("Login Component")
    ).toBeInTheDocument();
  });
});


  /* ======================
     WORKS COMPONENT
  ====================== */
  it("renders Works component", () => {
    renderHero();

    expect(
      screen.getByText("Works Component")
    ).toBeInTheDocument();
  });
});
