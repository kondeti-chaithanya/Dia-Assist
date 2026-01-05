import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "./AuthContext";

/* ======================
   HELPER RENDER FUNCTION
====================== */
const renderWithAuth = ({
  isAuthenticated,
  loading,
}: {
  isAuthenticated: boolean;
  loading: boolean;
}) => {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        error: null,
        user: null,
        setIsAuthenticated: () => {},
        setUser: () => {},
        setError: () => {},
        logout: async () => {},
        clearError: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/"
            element={<div>Home Page</div>}
          />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("ProtectedRoute", () => {
  /* ======================
     LOADING STATE
  ====================== */
  it("shows loading spinner when loading is true", () => {
    renderWithAuth({
      isAuthenticated: false,
      loading: true,
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  /* ======================
     NOT AUTHENTICATED
  ====================== */
  it("redirects to home when user is not authenticated", () => {
    renderWithAuth({
      isAuthenticated: false,
      loading: false,
    });

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(
      screen.queryByText("Protected Content")
    ).not.toBeInTheDocument();
  });

  /* ======================
     AUTHENTICATED
  ====================== */
  it("renders children when user is authenticated", () => {
    renderWithAuth({
      isAuthenticated: true,
      loading: false,
    });

    expect(
      screen.getByText("Protected Content")
    ).toBeInTheDocument();
  });
});
