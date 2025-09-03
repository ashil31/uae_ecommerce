// utils/authChecker.js
import { store } from '../store/store';
import { isTokenExpired } from './tokenUtils';
import { performLogout } from './authUtils';
import authAPI from '../api/authAPI';

/**
 * Check if user is currently authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  const state = store.getState();
  const token = state.auth.accessToken || localStorage.getItem('accessToken');
  
  if (!token) {
    return false;
  }
  
  // Check if token is expired
  if (isTokenExpired(token)) {
    console.log('🔄 Token expired, clearing auth state');
    localStorage.removeItem('accessToken');
    return false;
  }
  
  return state.auth.isAuthenticated;
};

/**
 * Validate current authentication status
 * @returns {Promise<boolean>} Validation result
 */
export const validateAuthStatus = async () => {
  try {
    if (!isAuthenticated()) {
      return false;
    }

    // Try to fetch user profile to validate token
    const response = await authAPI.getProfile();
    
    if (response.data.success) {
      console.log('✅ Auth status validated');
      return true;
    } else {
      console.log('❌ Auth validation failed');
      performLogout('invalid_session', false);
      return false;
    }
  } catch (error) {
    console.log('❌ Auth validation error:', error.message);
    
    // If it's a 401 error, logout user
    if (error.response?.status === 401) {
      performLogout('session_expired', false);
    }
    
    return false;
  }
};

/**
 * Check authentication status and redirect if needed
 * @param {string} redirectPath - Path to redirect to if not authenticated
 * @returns {boolean} Authentication status
 */
export const requireAuth = (redirectPath = '/login') => {
  const authenticated = isAuthenticated();
  
  if (!authenticated && typeof window !== 'undefined') {
    console.log('🚫 Authentication required, redirecting to login');
    window.location.href = redirectPath;
  }
  
  return authenticated;
};

/**
 * Get current user from store
 * @returns {Object|null} Current user object or null
 */
export const getCurrentUser = () => {
  const state = store.getState();
  return state.auth.user;
};

/**
 * Check if user has specific role
 * @param {string|Array} roles - Role(s) to check
 * @returns {boolean} Whether user has the role
 */
export const hasRole = (roles) => {
  const user = getCurrentUser();
  
  if (!user || !user.role) {
    return false;
  }
  
  const userRole = user.role;
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return allowedRoles.includes(userRole);
};

/**
 * Debug authentication state
 * @returns {Object} Debug information
 */
export const debugAuthState = () => {
  const state = store.getState();
  const token = localStorage.getItem('accessToken');
  
  return {
    storeAuth: {
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user ? 'Present' : 'Missing',
      accessToken: state.auth.accessToken ? 'Present' : 'Missing',
      userType: state.auth.userType
    },
    localStorage: {
      accessToken: token ? 'Present' : 'Missing',
      tokenExpired: token ? isTokenExpired(token) : 'No token'
    },
    computed: {
      isAuthenticated: isAuthenticated(),
      currentUser: getCurrentUser()
    }
  };
};

export default {
  isAuthenticated,
  validateAuthStatus,
  requireAuth,
  getCurrentUser,
  hasRole,
  debugAuthState
};