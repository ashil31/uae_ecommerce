// utils/errorHandler.js
import { performLogout } from './authUtils';

/**
 * Handle API errors consistently across the application
 * @param {Object} error - Error object from API call
 * @param {string} context - Context where error occurred
 * @returns {Object} Processed error object
 */
export const handleApiError = (error, context = 'API call') => {
  console.error(`❌ Error in ${context}:`, error);

  // Network errors
  if (!error.response) {
    return {
      message: 'Network error. Please check your connection.',
      type: 'network',
      shouldRetry: true
    };
  }

  const { status, data } = error.response;

  // Authentication errors
  if (status === 401) {
    const errorCode = data?.code;
    
    switch (errorCode) {
      case 'TOKEN_EXPIRED':
        return {
          message: 'Your session has expired. Please login again.',
          type: 'auth',
          shouldLogout: true
        };
      
      case 'TOKEN_INVALID':
        return {
          message: 'Invalid session. Please login again.',
          type: 'auth',
          shouldLogout: true
        };
      
      case 'TOKEN_MISSING':
        return {
          message: 'Authentication required. Please login.',
          type: 'auth',
          shouldLogout: true
        };
      
      default:
        return {
          message: data?.message || 'Authentication failed. Please login again.',
          type: 'auth',
          shouldLogout: true
        };
    }
  }

  // Authorization errors
  if (status === 403) {
    const errorCode = data?.code;
    
    if (errorCode === 'ACCOUNT_SUSPENDED') {
      performLogout('account_suspended', true);
      return {
        message: 'Your account has been suspended.',
        type: 'forbidden',
        shouldLogout: true
      };
    }
    
    return {
      message: data?.message || 'You do not have permission to perform this action.',
      type: 'forbidden'
    };
  }

  // Server errors
  if (status >= 500) {
    return {
      message: 'Server error. Please try again later.',
      type: 'server',
      shouldRetry: true
    };
  }

  // Client errors
  if (status >= 400) {
    return {
      message: data?.message || 'Request failed. Please check your input.',
      type: 'client'
    };
  }

  // Default error
  return {
    message: data?.message || 'An unexpected error occurred.',
    type: 'unknown'
  };
};

/**
 * Create a standardized error response
 * @param {string} message - Error message
 * @param {string} type - Error type
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error object
 */
export const createError = (message, type = 'unknown', details = {}) => {
  return {
    message,
    type,
    timestamp: new Date().toISOString(),
    ...details
  };
};

/**
 * Log errors for debugging
 * @param {Object} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = 'Unknown') => {
  const errorInfo = {
    context,
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    }
  };

  console.error('🐛 Error Log:', errorInfo);

  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to error tracking service
    // errorTrackingService.log(errorInfo);
  }
};

export default {
  handleApiError,
  createError,
  logError
};