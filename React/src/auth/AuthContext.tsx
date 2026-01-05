import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import api from "@/api/axiosConfig";

/* ======================
   TYPES
====================== */

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
  logout: () => Promise<void>;
  clearError: () => void;
}

/* ======================
   CONTEXT
====================== */

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  setIsAuthenticated: () => {},
  setUser: () => {},
  setError: () => {},
  logout: async () => {},
  clearError: () => {},
});

/* ======================
   PROVIDER
====================== */

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================
     CLEAR ERROR
  ====================== */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /* ======================
     CHECK AUTH (COOKIE)
     Runs on app load / refresh
  ====================== */
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      if (response.data?.email) {
        console.log(
          "Auth check successful:",
          response.data.email
        );
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("Invalid user response");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("ℹUser not authenticated");
      } else {
        console.error("Auth check failed:", err.message);
      }

      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);


  /* ======================
     LOGOUT
  ====================== */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      console.log("✅ Logout successful");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    }
  }, []);

  /* ======================
     MEMOIZED CONTEXT VALUE
  ====================== */
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      error,
      setIsAuthenticated,
      setUser,
      setError,
      logout,
      clearError,
    }),
    [
      isAuthenticated,
      user,
      loading,
      error,
      logout,
      clearError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
