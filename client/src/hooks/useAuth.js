/**
 * useAuth Hook - Authentication state management
 */

import { useCallback, useEffect, useState } from "react";
import { authService } from "../services";

const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const token = authService.getToken();
    return decodeToken(token);
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated(),
  );

  // Get user role
  const userRole = user?.role || authService.getUserRole() || "user";

  // Handle unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      setError("Session expired. Please log in again.");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    // Client-side validation
    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      setError(error.message);
      setLoading(false);
      throw error;
    }

    if (name.trim().length < 2) {
      const error = new Error("Name must be at least 2 characters");
      setError(error.message);
      setLoading(false);
      throw error;
    }

    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      setError(error.message);
      setLoading(false);
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format");
      setError(error.message);
      setLoading(false);
      throw error;
    }

    try {
      const response = await authService.register(name, email, password);
      const token = response.data?.accessToken || response.accessToken;
      
      if (!token) {
        throw new Error("Registration successful but no token received");
      }

      authService.setToken(token);
      setIsAuthenticated(true);
      setUser(decodeToken(token));
      return response;
    } catch (err) {
      const message = err.data?.message || err.message || "Registration failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    // Client-side validation
    if (!email || !password) {
      const error = new Error("Email and password are required");
      setError(error.message);
      setLoading(false);
      throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format");
      setError(error.message);
      setLoading(false);
      throw error;
    }

    try {
      const response = await authService.login(email, password);
      const token = response.data?.accessToken || response.accessToken;
      
      if (!token) {
        throw new Error("Login successful but no token received");
      }

      authService.setToken(token);
      setIsAuthenticated(true);
      setUser(decodeToken(token));
      return response;
    } catch (err) {
      const message = err.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) return null;
    try {
      const response = await authService.getMe();
      const userData = response.data || response;
      setUser((prev) => ({ ...prev, ...userData }));
      return userData;
    } catch (err) {
      console.warn("Failed to fetch user, token might be invalid", err);
      // Optional: handle auth error, trigger logout etc.
      return null;
    }
  }, [isAuthenticated]);

  return {
    user,
    setUser,
    loading,
    error,
    isAuthenticated,
    userRole,
    register,
    login,
    logout,
    fetchUser,
  };
};
