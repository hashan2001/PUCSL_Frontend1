import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  console.log('🔐 ProtectedRoute Check:', {
    path: location.pathname,
    role: role,
    allowedRoles: allowedRoles,
    hasToken: !!token
  });

  // 1. Check if user is logged in
  if (!token) {
    console.log('❌ No token found - Redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has correct role
  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log(`❌ Role "${role}" not allowed for ${location.pathname}`);
    
    // Redirect to appropriate dashboard based on role
    if (role === 'ADMIN') {
      return <Navigate to="/admindashboard" replace />;
    } else if (role === 'PROVIDER') {
      return <Navigate to="/providerdashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // 3. User is authorized - render the protected component
  console.log('✅ Access granted to', location.pathname);
  return children;
};

export default ProtectedRoute;