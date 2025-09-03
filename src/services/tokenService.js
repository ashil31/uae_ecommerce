// services/tokenService.js
import { store } from '../store/store';
import { refreshToken, logoutUser } from '../store/slices/authSlice';
import { isTokenExpired, getTimeUntilExpiry } from '../utils/tokenUtils';
import { performLogout } from '../utils/authUtils';

class TokenService {
  constructor() {
    this.refreshTimer = null;
    this.isRefreshing = false;
  }

  /**
   * Start automatic token refresh
   */
  startTokenRefresh() {
    this.stopTokenRefresh(); // Clear any existing timer
    
    const state = store.getState();
    const token = state.auth.accessToken || localStorage.getItem('accessToken');
    
    if (!token || isTokenExpired(token)) {
      console.log('🔄 Token expired or missing, attempting refresh...');
      this.refreshTokenNow();
      return;
    }

    const timeUntilExpiry = getTimeUntilExpiry(token);
    // Refresh 2 minutes before expiry (or immediately if less than 2 minutes left)
    const refreshTime = Math.max(0, timeUntilExpiry - (2 * 60 * 1000));
    
    console.log(`⏰ Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
    
    this.refreshTimer = setTimeout(() => {
      this.refreshTokenNow();
    }, refreshTime);
  }

  /**
   * Stop automatic token refresh
   */
  stopTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Refresh token immediately
   */
  async refreshTokenNow() {
    if (this.isRefreshing) {
      console.log('🔄 Token refresh already in progress...');
      return;
    }

    this.isRefreshing = true;
    
    try {
      console.log('🔄 Refreshing access token...');
      const result = await store.dispatch(refreshToken());
      
      if (refreshToken.fulfilled.match(result)) {
        console.log('✅ Token refreshed successfully');
        // Schedule next refresh
        this.startTokenRefresh();
      } else {
        console.error('❌ Token refresh failed:', result.payload);
        this.handleRefreshFailure(result.payload);
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      this.handleRefreshFailure(error);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Handle refresh failure
   */
  handleRefreshFailure(error = null) {
    console.log('🚪 Logging out due to refresh failure...');
    this.stopTokenRefresh();
    
    // Use the centralized logout utility
    const reason = error?.response?.data?.shouldLogout ? 'session_expired' : 'refresh_failed';
    performLogout(reason, true);
  }

  /**
   * Initialize token service
   */
  init() {
    // Start token refresh on initialization
    this.startTokenRefresh();

    // Listen for auth state changes
    let previousAuthState = store.getState().auth.isAuthenticated;
    
    store.subscribe(() => {
      const currentAuthState = store.getState().auth.isAuthenticated;
      
      if (currentAuthState !== previousAuthState) {
        previousAuthState = currentAuthState;
        
        if (currentAuthState) {
          console.log('🔐 User authenticated, starting token refresh service');
          this.startTokenRefresh();
        } else {
          console.log('🚪 User logged out, stopping token refresh service');
          this.stopTokenRefresh();
        }
      }
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && store.getState().auth.isAuthenticated) {
        // Page became visible, check if token needs refresh
        const token = store.getState().auth.accessToken || localStorage.getItem('accessToken');
        if (token && isTokenExpired(token)) {
          console.log('🔄 Page visible and token expired, refreshing...');
          this.refreshTokenNow();
        }
      }
    });
  }
}

// Create singleton instance
const tokenService = new TokenService();

export default tokenService;