import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};