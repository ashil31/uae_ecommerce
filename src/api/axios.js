// src/api/axios.js
import axios from 'axios';
import { serverUrl } from '../services/url';
import { store } from '../store/store';
import { logoutUser, setAccessTokenAction } from '../store/slices/authSlice';
import { performLogout, shouldLogoutUser } from '../utils/authUtils';
import { handleApiError, logError } from '../utils/errorHandler';

const axiosInstance = axios.create({
  baseURL: serverUrl || 'http://localhost:4000/api',
  withCredentials: true,
});

// ✅ Use raw axios without interceptors for refresh call
const rawAxios = axios.create({
  baseURL: serverUrl || 'http://localhost:4000/api',
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken || localStorage.getItem('accessToken');

    return config;
  },
  (error) => Promise.reject(error)  
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/')) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Access token expired, attempting refresh...');
        
        // ✅ Use raw axios to call refresh to avoid interceptor recursion
        const refreshRes = await rawAxios.post('/auth/refresh');

        console.log('✅ RefreshTokenResponse:', refreshRes.data);
        
        if (refreshRes.data.success && refreshRes.data.accessToken) {
          const newAccessToken = refreshRes.data.accessToken;
          
          // Update stored access token
          localStorage.setItem('accessToken', newAccessToken);
          store.dispatch(setAccessTokenAction(newAccessToken));
          
          // Update the original request headers with new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['x-access-token'] = newAccessToken;
          
          console.log('🔄 Retrying original request with new token...');
          
          // Retry original request with new token
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Invalid refresh response');
        }
      } catch (refreshError) {
        logError(refreshError, 'Token refresh');
        
        // Handle refresh error
        const errorInfo = handleApiError(refreshError, 'Token refresh');
        
        // Check if it's a network error or server error
        if (refreshError.response?.status >= 500) {
          console.log('🔄 Server error during refresh, will retry later');
          return Promise.reject(error);
        }
        
        // Use the auth utility to handle logout consistently
        if (errorInfo.shouldLogout || shouldLogoutUser(refreshError)) {
          performLogout('session_expired', true);
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other authentication errors
    if (error.response?.status === 403 && error.response?.data?.code === 'ACCOUNT_SUSPENDED') {
      performLogout('account_suspended', true);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
