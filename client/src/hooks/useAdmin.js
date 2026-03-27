/**
 * useAdmin Hook - Admin dashboard data management
 */

import { useCallback, useState } from "react";
import { adminService } from "../services";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getSummary();
      return response.data || response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to fetch summary";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserGrowth = useCallback(async (range = "7d") => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getUserGrowth(range);
      return response.data || response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to fetch user growth";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMoodTrend = useCallback(async (range = "7d") => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getMoodTrend(range);
      return response.data || response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to fetch mood trend";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAtRiskUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAtRiskUsers();
      return response.data || response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to fetch at-risk users";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAllUsers();
      return response.data || response;
    } catch (err) {
      const message = err.data?.message || err.message || "Failed to fetch all users";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getSummary,
    getUserGrowth,
    getMoodTrend,
    getAtRiskUsers,
    getAllUsers,
  };
};
