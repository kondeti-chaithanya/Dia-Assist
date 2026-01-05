import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  // REQUIRED – sends cookies with requests
  withCredentials: true,
});

/**
 * Response interceptor for global error handling
 * NOTE:
 * - Guarded for test environments where axios may be mocked
 * - Prevents `interceptors` undefined crash in Vitest
 */
if (api?.interceptors?.response) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Avoid redirect loop for auth check
        if (error.config?.url && !error.config.url.includes("/auth/me")) {
          console.warn("Session expired - redirecting to login");

          // Use globalThis instead of window
          globalThis.location.href = "/";
        }
      }

      return Promise.reject(error);
    }
  );
}

export default api;
