import { useState, useContext, useEffect } from "react";
import api from "../../api/axiosConfig";
import { AuthContext } from "../../auth/AuthContext";
import "./auth.css";

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
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const { setIsAuthenticated, setUser, setError } = useContext(AuthContext);

  // Auto-clear error messages after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 1) {
      errors.password = "Password cannot be empty";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setAuthError("");
    setFieldErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Trim email to prevent whitespace issues
      const trimmedEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email: trimmedEmail,
        password,
      });

      // Validate response structure
      if (!response.data) {
        throw new Error("Invalid response from server");
      }

      console.log("Login API Response:", response.data);

      // Extract token - handle both direct token string and nested object
      let token: string | null = null;
      
      if (typeof response.data === "string") {
        token = response.data;
      } else if (response.data.token) {
        token = response.data.token;
      } else if (response.data.jwt) {
        token = response.data.jwt;
      } else if (response.data.accessToken) {
        token = response.data.accessToken;
      }

      if (!token) {
        console.warn(" No token found. Response:", response.data);
        throw new Error("No token received from server");
      }

      console.log(" Token extracted:", token.substring(0, 20) + "...");

      // Validate and save token
      localStorage.setItem("token", token);
      console.log(" Token saved securely");

      // Extract user data - handle nested user object from backend
      const userObj = response.data.user || response.data;
      
      const userId = userObj.id;
      const userName = userObj.name || userObj.username || trimmedEmail.split("@")[0] || "User";

      const userData = {
        name: userName,
        email: trimmedEmail,
        id: userId,
      };

      console.log("👤 User object from response:", userObj);
      console.log("👤 Extracted userId:", userId);
      console.log("👤 Extracted name:", userName);
      console.log("👤 Final user data object:", userData);

      // Validate user data
      if (!userData.email || typeof userData.email !== "string") {
        throw new Error("Invalid user data received");
      }

      localStorage.setItem("user", JSON.stringify(userData));
      console.log(" User data saved");

      // Calculate token expiry (24 hours from now)
      const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem("tokenExpiry", tokenExpiry.toString());

      // Update global auth state
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);

      console.log(" Auth state updated");

      // Clear form
      setEmail("");
      setPassword("");

      // Close modal after successful login
      onSuccess();

    } catch (error: any) {
      console.error(" Login Error:", error);

      // Handle specific error types
      if (error.response?.status === 401) {
        setAuthError("Incorrect email address or password");
      } else if (error.response?.status === 429) {
        setAuthError("Too many login attempts. Please try again later");
      } else if (error.response?.status === 400) {
        setAuthError(error.response.data?.message || "Invalid email or password");
      } else if (error.code === "ECONNABORTED") {
        setAuthError("Login request timed out. Please try again");
      } else if (!error.response) {
        setAuthError("Network error. Please check your connection");
      } else {
        setAuthError(error.response?.data?.message || "Login failed. Please try again");
      }

      setError(authError);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin(e as any);
    }
  };

  return (
    <>
      <h2 className="auth-title">Sign in</h2>

      <form onSubmit={handleLogin}>
        {/* Email */}
        <div className="floating-field">
          <label htmlFor="email">Email address</label>
          <div className={`input-wrapper ${fieldErrors.email ? "input-error" : ""}`}>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              required
              disabled={loading}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
          </div>
          {fieldErrors.email && (
            <span id="email-error" className="field-error">
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="floating-field">
          <label htmlFor="password">Password</label>
          <div className={`input-wrapper ${fieldErrors.password ? "input-error" : ""}`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              required
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            <span
              className="input-action icon"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁" : "👁"}
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
            <span className="error-icon">⚠️</span>
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
