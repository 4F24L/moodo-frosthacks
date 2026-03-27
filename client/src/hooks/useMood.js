/**
 * useMood Hook - Mood analysis state management
 */

import { useCallback, useState } from "react";
import { moodService } from "../services";

export const useMood = () => {
  const [moodData, setMoodData] = useState(null);
  const [history, setHistory] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [trend, setTrend] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processAudio = useCallback(async (audioFile, text) => {
    setLoading(true);
    setError(null);
    try {
      const res = await moodService.processAudio(audioFile, text);
      const response = res.data || res;
      setMoodData(response);
      return response;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to process audio";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeMood = useCallback(async (features, text) => {
    setLoading(true);
    setError(null);
    try {
      const response = await moodService.analyzeMood(features, text);
      setMoodData(response);
      return response;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to analyze mood";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getHistory = useCallback(async (range = "7d", limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await moodService.getHistory(range, limit);
      const data = response.data || response;
      setHistory(data);
      return data;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to fetch history";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLatest = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await moodService.getLatest();
      setMoodData(response);
      return response;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to fetch latest mood";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrend = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await moodService.getTrend();
      setTrend(response);
      return response;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to fetch trend";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDashboard = useCallback(async (range = "7d") => {
    setLoading(true);
    setError(null);
    try {
      const response = await moodService.getDashboard(range);
      const data = response.data || response;
      setDashboard(data);
      return data;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to fetch dashboard";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStreak = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await moodService.getStreak();
      const data = response.data || response;
      setStreak(data.streak);
      return data;
    } catch (err) {
      const message =
        err.data?.message || err.message || "Failed to fetch streak";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    moodData,
    history,
    dashboard,
    trend,
    streak,
    loading,
    error,
    processAudio,
    analyzeMood,
    getHistory,
    getLatest,
    getTrend,
    getDashboard,
    getStreak,
  };
};
