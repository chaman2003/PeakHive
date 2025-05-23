import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * A wrapper component that redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Get user info from Redux store
  const { userInfo } = useSelector((state) => state.user);

  // Add debugging
  console.log('ProtectedRoute check:', {
    path: location.pathname,
    userInfo: userInfo ? {
      _id: userInfo._id,
      firstName: userInfo.firstName,
      hasToken: !!userInfo.token
    } : 'Not logged in',
    storage: localStorage.getItem('userInfo') ? 'Found in localStorage' : 'Not in localStorage'
  });

  if (!userInfo) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected route
  return children;
};

export default ProtectedRoute; 