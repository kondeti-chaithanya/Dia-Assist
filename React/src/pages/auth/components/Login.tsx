import { useState, useContext, useEffect } from "react";
import api from "../../../api/axiosConfig";
import { AuthContext } from "../../../auth/AuthContext";
import "../styles/auth.css";

interface LoginProps {
  switchToRegister: () => void;
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({
  switchToRegister,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [authError, setAuthError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const { setIsAuthenticated, setUser, setError } =
    useContext(AuthContext);

  /* ======================
     AUTO CLEAR AUTH ERROR
  ====================== */
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  /* ======================
     VALIDATIONS
  ====================== */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  /* ======================
     LOGIN HANDLER
  ====================== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError("");
    setFieldErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email: trimmedEmail,
        password,
      });

      if (!response.data?.email) {
        throw new Error("Invalid login response");
      }

      console.log("✅ Login successful - setting auth state");
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);

      setEmail("");
      setPassword("");
      onSuccess();
    } catch (error: any) {
      console.error("Login Error:", error);

      if (error.response?.status === 401) {
        setAuthError("Incorrect email address or password");
      } else if (!error.response) {
        setAuthError("Network error. Please check your connection");
      } else {
        setAuthError("Login failed. Please try again");
      }

      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <>
      <h2 className="auth-title">Sign in</h2>

      {/* 🔑 noValidate disables browser validation */}
      <form onSubmit={handleLogin} noValidate>
        {/* EMAIL */}
        <div className="floating-field">
          <label htmlFor="email">Email address</label>
          <div
            className={`input-wrapper ${
              fieldErrors.email ? "input-error" : ""
            }`}
          >
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors({ ...fieldErrors, email: undefined });
                }
              }}
              placeholder="Enter your email"
              disabled={loading}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={
                fieldErrors.email ? "email-error" : undefined
              }
            />
          </div>
          {fieldErrors.email && (
            <span id="email-error" className="field-error">
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* PASSWORD */}
        <div className="floating-field">
          <label htmlFor="password">Password</label>
          <div
            className={`input-wrapper ${
              fieldErrors.password ? "input-error" : ""
            }`}
          >
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors({
                    ...fieldErrors,
                    password: undefined,
                  });
                }
              }}
              placeholder="Enter your password"
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
            />
            <span
              className="input-action icon"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              👁
            </span>
          </div>
          {fieldErrors.password && (
            <span id="password-error" className="field-error">
              {fieldErrors.password}
            </span>
          )}
        </div>

        {/* AUTH ERROR */}
        {authError && (
          <div className="auth-error" role="alert">
            {authError}
          </div>
        )}

        <button
          className="auth-btn"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-switch">
        Don’t have an account?
        <span onClick={switchToRegister}> Create one</span>
      </p>
    </>
  );
};

export default Login;


