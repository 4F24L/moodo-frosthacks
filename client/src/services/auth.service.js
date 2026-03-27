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
};
