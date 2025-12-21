import { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosConfig";
import "./auth.css";

interface RegisterProps {
  switchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [authError, setAuthError] = useState("");

  // Auto-clear error messages after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  // Auto-redirect to login after showing success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        switchToLogin();
      }, 2500); // Show success message for 2.5 seconds
      return () => clearTimeout(timer);
    }
  }, [success, switchToLogin]);

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasLowerCase && hasNumbers && isLongEnough;
  };

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, numbers (min 8 characters)";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setAuthError("");
    setLoading(true);

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/register", {
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      // If successful, show success screen
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
      }
    } catch (error: any) {
      console.error(" Registration Error:", error);

      // Handle different error types
      if (error.response?.status === 409) {
        setAuthError("Email already registered. Please use a different email.");
      } else if (error.response?.status === 400) {
        setAuthError(error.response.data?.message || "Invalid request. Please check your information.");
      } else if (error.response?.status === 429) {
        setAuthError("Too many registration attempts. Please try again later.");
      } else if (error.code === "ECONNABORTED") {
        setAuthError("Request timed out. Please try again.");
      } else if (!error.response) {
        setAuthError("Network error. Please check your connection.");
      } else if (error.response?.status >= 500) {
        setAuthError("Server error. Please try again later.");
      } else {
        setAuthError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleRegister(e as any);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="auth-success-container">
        <div className="success-icon">✓</div>
        <h2 className="success-title">Account created successfully!</h2>
        <p className="success-message">
          Welcome {name.split(" ")[0]}! Redirecting to sign in...
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="auth-title">Create account</h2>
      <form onSubmit={handleRegister}>
        {/* AUTH ERROR */}
        {authError && (
          <div className="auth-error" role="alert">
            <span className="error-icon">⚠️</span>
            {authError}
          </div>
        )}

        {/* Name */}
        <div className="floating-field">
          <label htmlFor="name">Full name</label>
          <div className={`input-wrapper ${errors.name ? "input-error" : ""}`}>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </div>
          {errors.name && (
            <span id="name-error" className="field-error">
              {errors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="floating-field">
          <label htmlFor="email">Email address</label>
          <div className={`input-wrapper ${errors.email ? "input-error" : ""}`}>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          {errors.email && (
            <span id="email-error" className="field-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="floating-field">
          <label htmlFor="password">Password</label>
          <div className={`input-wrapper ${errors.password ? "input-error" : ""}`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <span
              className="input-action icon"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>
          {errors.password && (
            <span id="password-error" className="field-error">
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="floating-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <div className={`input-wrapper ${errors.confirmPassword ? "input-error" : ""}`}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            />
            <span
              className="input-action icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              role="button"
              tabIndex={0}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </span>
          </div>
          {errors.confirmPassword && (
            <span id="confirmPassword-error" className="field-error">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <button 
          className="auth-btn" 
          type="submit" 
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account?
        <span onClick={switchToLogin}> Sign in</span>
      </p>
    </>
  );
};

export default Register;