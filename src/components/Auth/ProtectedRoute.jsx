
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole = 'wholesaler' }) => {
  const location = useLocation();
  const { userType } = useSelector((state) => state.auth);

  if (userType !== 'wholesaler') {
    toast.success('Please contact the admin for access');
    return <Navigate to="/contact" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
