
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const AdminRoute = ({ children }) => {
//   const location = useLocation();
//   const { isAuthenticated, userType } = useSelector((state) => state.auth);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (userType !== 'admin') {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default AdminRoute;
