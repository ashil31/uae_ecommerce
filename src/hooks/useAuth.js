
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser, refreshToken } from '../store/slices/authSlice';
import { isTokenExpired } from '../utils/tokenUtils';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, accessToken } = useSelector((state) => state.auth);

  // Check token validity on mount and when token changes
  useEffect(() => {
    if (isAuthenticated && accessToken && isTokenExpired(accessToken)) {
      console.log('🔄 Token expired in useAuth, attempting refresh...');
      dispatch(refreshToken());
    }
  }, [isAuthenticated, accessToken, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const isGuest = () => !isAuthenticated;
  const isRetailCustomer = () => isAuthenticated && user?.role === 'customer';
  const isWholesaler = () => isAuthenticated && user?.role === 'wholesaler';
  const isAdmin = () => isAuthenticated && user?.role === 'admin';

  const requireAuth = (callback) => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    callback?.();
    return true;
  };

  const requireRole = (requiredRole, callback) => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    if (user?.role !== requiredRole) {
      navigate('/');
      return false;
    }
    callback?.();
    return true;
  };

  const checkAuthStatus = () => {
    if (!isAuthenticated || !accessToken) {
      return false;
    }
    
    if (isTokenExpired(accessToken)) {
      dispatch(refreshToken());
      return false;
    }
    
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    isGuest,
    isRetailCustomer,
    isWholesaler,
    isAdmin,
    handleLogout,
    requireAuth,
    requireRole,
    checkAuthStatus,
  };
};
