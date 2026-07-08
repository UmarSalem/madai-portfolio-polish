import React from 'react';
import { Navigate } from 'react-router';
import { getStoredAuthUser } from '../api/authSession';
import { ROUTE } from './ReactLinks';

const ProtectedRoute = ({ children }) => {
  const user = getStoredAuthUser();

  if (!user?.token) {
    return <Navigate to={ROUTE.Login} replace />;
  }

  return children;
};

export default ProtectedRoute;
