import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "./Header";
import { AuthContext } from "@/auth/AuthContext";
import { BrowserRouter } from "react-router-dom";

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
vi.mock("../../modal/components/Modal", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/pages/auth/components/Login", () => ({
  default: ({ onSuccess }: any) => (
    <button onClick={onSuccess}>Mock Login</button>
  ),
}));

vi.mock("@/pages/auth/components/Register", () => ({
  default: ({ switchToLogin }: any) => (
    <button onClick={switchToLogin}>Mock Register</button>
  ),
}));

/* ======================
   RENDER HELPER
====================== */
const renderNavbar = ({
  isAuthenticated = false,
  user = null,
}: {
  isAuthenticated?: boolean;
  user?: any;
}) => {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading: false,
        error: null,
        setIsAuthenticated: () => {},
        setUser: () => {},
        setError: () => {},
        logout: vi.fn(),
        clearError: () => {},
      }}
    >
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("Navbar / Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ======================
     UNAUTHENTICATED STATE
  ====================== */
  it("shows Sign In button when user is not authenticated", () => {
    renderNavbar({ isAuthenticated: false });

    expect(
      screen.getByRole("button", { name: "Sign In" })
    ).toBeInTheDocument();
  });

  it("opens login modal when Sign In is clicked", () => {
    renderNavbar({ isAuthenticated: false });

    fireEvent.click(
      screen.getByRole("button", { name: "Sign In" })
    );

    expect(screen.getByText("Mock Login")).toBeInTheDocument();
  });

  /* ======================
     PROTECTED NAVIGATION
  ====================== */
  it("opens login modal when accessing protected route unauthenticated", () => {
    renderNavbar({ isAuthenticated: false });

    fireEvent.click(screen.getByText("Dashboard"));

    expect(screen.getByText("Mock Login")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /* ======================
     AUTHENTICATED STATE
  ====================== */
  it("shows user avatar when authenticated", () => {
    renderNavbar({
      isAuthenticated: true,
      user: { name: "Vicky", email: "vicky@test.com" },
    });

    expect(screen.getByText("V")).toBeInTheDocument();
  });

  it("navigates to protected route when authenticated", () => {
    renderNavbar({
      isAuthenticated: true,
      user: { name: "Vicky", email: "vicky@test.com" },
    });

    fireEvent.click(screen.getByText("Dashboard"));

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  /* ======================
     LOGOUT
  ====================== */
  it("logs out user when Sign Out is clicked", () => {
    const logoutMock = vi.fn();

    render(
      <AuthContext.Provider
        value={{
          isAuthenticated: true,
          user: { name: "Vicky", email: "vicky@test.com" },
          loading: false,
          error: null,
          setIsAuthenticated: () => {},
          setUser: () => {},
          setError: () => {},
          logout: logoutMock,
          clearError: () => {},
        }}
      >
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthContext.Provider>
    );

    // Open profile dropdown
    fireEvent.click(screen.getByText("V"));

    // Click ONLY the button Sign Out (not mobile <li>)
    fireEvent.click(
      screen.getByRole("button", { name: "Sign Out" })
    );

    expect(logoutMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
