// utils/authUtils.js
import { store } from '../store/store';
import { logoutUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

/**
 * Perform complete logout - clear tokens, dispatch logout action, redirect
 * @param {string} reason - Reason for logout (optional)
 * @param {boolean} showMessage - Whether to show logout message
 */
export const performLogout = (reason = 'User logout', showMessage = false) => {
  console.log(`🚪 Performing logout: ${reason}`);
  
  // Clear localStorage
  localStorage.removeItem('accessToken');
  
  // Dispatch logout action
  store.dispatch(logoutUser());
  
  // Show message if requested
  if (showMessage && typeof window !== 'undefined') {
    const messages = {
      'session_expired': 'Your session has expired. Please login again.',
      'refresh_failed': 'Authentication failed. Please login again.',
      'token_invalid': 'Invalid session. Please login again.',
      'user_logout': 'You have been logged out successfully.'
    };
    
    const message = messages[reason] || 'You have been logged out.';
    
    // You can replace this with your toast notification system
    // toast.success(message);
  }
  
};

/**
 * Check if user should be logged out based on error response
 * @param {Object} error - Error object from API response
 * @returns {boolean} - Whether user should be logged out
 */
export const shouldLogoutUser = (error) => {
  return error?.response?.data?.shouldLogout || 
         error?.response?.status === 401 ||
         error?.message?.includes('refresh token');
};

/**
 * Handle authentication errors consistently
 * @param {Object} error - Error object
 * @param {string} context - Context where error occurred
 */
export const handleAuthError = (error, context = 'API call') => {
  console.error(`❌ Auth error in ${context}:`, error);
  
  if (shouldLogoutUser(error)) {
    performLogout('session_expired', true);
  }
};