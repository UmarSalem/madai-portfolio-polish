import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { getStoredAuthUser } from '../api/authSession';
import { ROUTE } from './ReactLinks';

const ProtectedRoute = ({ children }) => {
  const user = getStoredAuthUser();
  const location = useLocation();

  if (!user?.token) {
    return <Navigate to={ROUTE.Login} replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
