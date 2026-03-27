/**
 * Admin Service - Admin Dashboard API endpoints
 */

import { apiClient } from "./client.js";

export const adminService = {
  /**
   * Get summary statistics
   * @returns {Promise<{totalUsers: number, activeUsers24h: number, averageMoodScore: number, atRiskUsers: number}>}
   */
  getSummary: () => apiClient.get("/admin/summary"),

  /**
   * Get user registration growth trend
   * @param {string} range - Time range (7d, 14d, 30d)
   * @returns {Promise<{data: Array, total: number, average: number, peak: number, growthPercentage: number}>}
   */
  getUserGrowth: (range = "7d") =>
    apiClient.get(`/admin/user-growth?range=${range}`),

  /**
   * Get mood trend over time
   * @param {string} range - Time range (7d, 14d, 30d)
   * @returns {Promise<{data: Array, overallTrend: string}>}
   */
  getMoodTrend: (range = "7d") =>
    apiClient.get(`/admin/mood-trend?range=${range}`),

  /**
   * Get list of at-risk users
   * @returns {Promise<Array<{userId: string, averageMood: number, trend: string}>>}
   */
  getAtRiskUsers: () => apiClient.get("/admin/at-risk-users"),

  /**
   * Get all users with their mood data
   * @returns {Promise<Array<{id: string, name: string, currentScore: number, status: string, riskLevel: string, lastUpdate: string, liveHistory: Array}>>}
   */
  getAllUsers: () => apiClient.get("/admin/all-users"),
};
