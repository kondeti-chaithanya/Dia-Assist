import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    // Do NOT attach token for auth APIs
    if (!config.url?.startsWith("/auth")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error(" Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      console.warn(" Unauthorized - Token may be expired");
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");
      // Optionally redirect to login
      window.location.href = "/";
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error(" Access forbidden");
    }

    // Handle 429 Too Many Requests (rate limiting)
    if (error.response?.status === 429) {
      console.error(" Too many requests - Rate limited");
      error.message = "Too many requests. Please try again later.";
    }

    // Handle 500+ Server Errors
    if (error.response?.status && error.response.status >= 500) {
      console.error(" Server error:", error.response.status);
    }

    // Handle network errors
    if (error.code === "ECONNABORTED") {
      console.error(" Request timeout");
      error.message = "Request timeout. Please check your connection.";
    }

    if (error.message === "Network Error") {
      console.error(" Network error - Server may be offline");
      error.message = "Network error. Please check your connection.";
    }

    return Promise.reject(error);
  }
);

export default api;
