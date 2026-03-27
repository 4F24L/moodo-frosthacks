/**
 * Date Utilities for IST (Indian Standard Time) conversion
 * IST is UTC+5:30
 */

/**
 * Convert any date to IST
 * @param {Date|string} date - Date to convert
 * @returns {Date} Date object in IST
 */
export const toIST = (date) => {
  const utcDate = new Date(date);
  // Create a formatter for IST
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return istFormatter.format(utcDate);
};

/**
 * Format date in IST
 * @param {Date|string} date 
 * @returns {string} Formatted date string
 */
export const formatDateIST = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format time in IST
 * @param {Date|string} date 
 * @returns {string} Formatted time string
 */
export const formatTimeIST = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format date and time in IST
 * @param {Date|string} date 
 * @returns {string} Formatted date-time string
 */
export const formatDateTimeIST = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get current IST time
 * @returns {string} Current IST time
 */
export const getCurrentIST = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata'
  });
};

/**
 * Example usage:
 * const utcTime = "2026-03-27T03:56:46.119Z";
 * console.log(formatDateTimeIST(utcTime)); // Will show IST time (UTC+5:30)
 */
