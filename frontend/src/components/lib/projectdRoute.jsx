import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if a token exists in localStorage (you can customize this)
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token, redirect to the admin login page
    return <Navigate to="/admin/login" replace />;
  }
  
  // Otherwise, render the protected component(s)
  return children;
};

export default ProtectedRoute;
