import axios from "axios";
import { tokenUtils } from "../utils/token";

/**
 * Axios instance — single HTTP client for the entire app.
 * Base URL is proxied through Vite dev server: /api → http://localhost:5000/api
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── Request Interceptor ───────────────────────────────────────────
// Attaches the JWT Bearer token to every outgoing request automatically.
api.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────
// Handles 401 globally: clears the stale session and sends user to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");

      // Only auto-logout on protected routes, not login failures
      if (!isAuthRoute) {
        tokenUtils.clearAll();
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;

