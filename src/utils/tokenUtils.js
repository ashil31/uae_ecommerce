// utils/tokenUtils.js

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - true if expired, false if valid
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Add a 30-second buffer to refresh before actual expiry
    return payload.exp < (currentTime + 30);
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {number|null} - expiry timestamp or null if invalid
 */
export const getTokenExpiry = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Get time until token expires
 * @param {string} token - JWT token
 * @returns {number} - milliseconds until expiry, 0 if expired
 */
export const getTimeUntilExpiry = (token) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return 0;
  
  const timeLeft = expiry - Date.now();
  return Math.max(0, timeLeft);
};