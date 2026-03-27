/**
 * API Client - Centralized HTTP client with interceptors
 * Handles authentication, error handling, and request/response transformation
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class APIClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("accessToken");
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token;
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.token = null;
    localStorage.removeItem("accessToken");
  }

  /**
   * Build headers with authentication
   */
  getHeaders(isFormData = false) {
    const headers = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const {
      method = "GET",
      body = null,
      isFormData = false,
      ...otherOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(isFormData);

    const config = {
      method,
      headers,
      ...otherOptions,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 - Unauthorized
      if (response.status === 401) {
        this.clearAuth();
        window.dispatchEvent(new Event("unauthorized"));
        throw new Error("Session expired. Please log in again.");
      }

      // Handle network errors or empty responses
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError);
          throw new Error("Invalid response from server");
        }
      } else {
        // Non-JSON response
        const text = await response.text();
        data = { message: text || "Unexpected response format" };
      }

      if (!response.ok) {
        const error = new Error(
          data.message || 
          data.error || 
          `Request failed with status ${response.status}`
        );
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        const networkError = new Error('Network error. Please check your connection.');
        networkError.status = 0;
        throw networkError;
      }

      // Handle timeout errors
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout. Please try again.');
        timeoutError.status = 408;
        throw timeoutError;
      }

      throw error;
    }
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { method: "GET", ...options });
  }

  /**
   * POST request
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, { method: "POST", body, ...options });
  }

  /**
   * PUT request
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, { method: "PUT", body, ...options });
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: "DELETE", ...options });
  }

  /**
   * POST FormData (for file uploads)
   */
  postFormData(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: formData,
      isFormData: true,
      ...options,
    });
  }
}

export const apiClient = new APIClient();
