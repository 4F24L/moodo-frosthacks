/**
 * Auth Service - Authentication API endpoints
 */

import { apiClient } from "./client.js";

export const authService = {
  /**
   * Register new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{accessToken: string}>}
   */
  register: (name, email, password) =>
    apiClient.post("/auth/register", { name, email, password }),

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{accessToken: string}>}
   */
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),

  /**
   * Logout user (client-side and server-side)
   */
  logout: async () => {
    try {
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      console.warn(
        "Logout request failed, proceeding with local clear:",
        error,
      );
    }
    apiClient.clearAuth();
  },

  /**
   * Set authentication token
   */
  setToken: (token) => {
    apiClient.setToken(token);
  },

  /**
   * Get current token
   */
  getToken: () => {
    return apiClient.getToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!apiClient.getToken();
  },

  /**
   * Get current user
   */
  getMe: () => apiClient.get("/auth/me"),

  /**
   * Get user role from token
   */
  getUserRole: () => {
    const token = apiClient.getToken();
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const payload = JSON.parse(jsonPayload);
      return payload.role || "user";
    } catch (e) {
      console.error("Failed to decode token", e);
      return null;
    }
  },
};
