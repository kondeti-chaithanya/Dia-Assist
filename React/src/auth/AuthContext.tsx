import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

interface User {
  name: string;
  email: string;
  id?: number | string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  setIsAuthenticated: () => {},
  setUser: () => {},
  setError: () => {},
  logout: () => {},
  clearError: () => {},
});

interface Props {
  children: ReactNode;
}

const TOKEN_KEY = "token";
const USER_KEY = "user";
const TOKEN_EXPIRY_KEY = "tokenExpiry";

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry, 10);
  }, []);

  // Initialize authentication from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_KEY);

      if (token && !isTokenExpired()) {
        setIsAuthenticated(true);
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            // Validate user object structure
            if (parsedUser && parsedUser.email && typeof parsedUser.email === "string") {
              setUser(parsedUser);
              console.log(" User loaded from localStorage:", parsedUser.email);
            } else {
              throw new Error("Invalid user data structure");
            }
          } catch (e) {
            console.error(" Failed to parse user data:", e);
            // Clear invalid data
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            setIsAuthenticated(false);
            setError("Session invalid. Please login again.");
          }
        }
      } else if (token && isTokenExpired()) {
        console.warn("⚠️ Token expired");
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
      }
    } catch (err) {
      console.error(" Auth initialization error:", err);
      setError("Failed to initialize authentication.");
    } finally {
      setLoading(false);
    }
  }, [isTokenExpired]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      console.log(" User logged out successfully");
    } catch (err) {
      console.error(" Logout error:", err);
      setError("Failed to logout properly.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        setIsAuthenticated,
        setUser,
        setError,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
