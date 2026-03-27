/**
 * Error Handler Utility
 * Centralized error handling and user-friendly error messages
 */

/**
 * Get user-friendly error message based on error type
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message if no specific message found
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error, defaultMessage = "An error occurred") => {
  if (!error) return defaultMessage;

  // Network errors
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return "Network error. Please check your internet connection.";
  }

  // Timeout errors
  if (error.name === 'AbortError') {
    return "Request timeout. Please try again.";
  }

  // HTTP status errors
  if (error.status) {
    switch (error.status) {
      case 0:
        return "Network error. Please check your internet connection.";
      case 400:
        return error.message || "Invalid request. Please check your input.";
      case 401:
        return "Session expired. Please log in again.";
      case 403:
        return "Access denied. You don't have permission to perform this action.";
      case 404:
        return "Resource not found. Please try again.";
      case 409:
        return error.message || "Conflict. This resource already exists.";
      case 413:
        return "File too large. Please upload a smaller file.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
      case 503:
        return "Service temporarily unavailable. Please try again in a moment.";
      case 504:
        return "Request timeout. Please try again.";
      default:
        return error.message || defaultMessage;
    }
  }

  // Return error message if available
  return error.message || defaultMessage;
};

/**
 * Log error for debugging
 * @param {string} context - Context where error occurred
 * @param {Error} error - The error object
 * @param {Object} additionalInfo - Additional information to log
 */
export const logError = (context, error, additionalInfo = {}) => {
  console.error(`[${context}]`, {
    message: error.message,
    status: error.status,
    name: error.name,
    stack: error.stack,
    ...additionalInfo,
  });
};

/**
 * Handle async errors with user notification
 * @param {Function} asyncFn - Async function to execute
 * @param {string} context - Context for error logging
 * @param {Function} onError - Optional error callback
 * @returns {Promise} Result of async function or null on error
 */
export const handleAsyncError = async (asyncFn, context, onError = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    logError(context, error);
    const message = getErrorMessage(error);
    
    if (onError) {
      onError(message, error);
    } else {
      alert(message);
    }
    
    return null;
  }
};

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    minSize = 1,
  } = options;

  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (file.size === 0 || file.size < minSize) {
    return { valid: false, error: "File is empty or too small" };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File too large. Maximum size is ${maxSizeMB}MB` };
  }

  if (allowedTypes.length > 0) {
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -2);
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return { valid: false, error: "Invalid file type" };
    }
  }

  return { valid: true, error: null };
};

/**
 * Validate text input
 * @param {string} text - Text to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateText = (text, options = {}) => {
  const {
    minLength = 1,
    maxLength = 5000,
    required = true,
    pattern = null,
  } = options;

  if (!text || text.trim().length === 0) {
    if (required) {
      return { valid: false, error: "This field is required" };
    }
    return { valid: true, error: null };
  }

  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `Minimum ${minLength} characters required` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Maximum ${maxLength} characters allowed` };
  }

  if (pattern && !pattern.test(trimmed)) {
    return { valid: false, error: "Invalid format" };
  }

  return { valid: true, error: null };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true, error: null };
};

/**
 * Create a retry wrapper for failed operations
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in ms
 * @returns {Promise} Result of function
 */
export const retryOperation = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

export default {
  getErrorMessage,
  logError,
  handleAsyncError,
  validateFile,
  validateText,
  validateEmail,
  retryOperation,
};
