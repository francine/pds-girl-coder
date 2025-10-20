import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  console.log('ProtectedRoute render - isAuthenticated:', isAuthenticated, 'loading:', loading);

  if (loading) {
    console.log('⚠️ ProtectedRoute: Showing loading spinner');
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('⚠️ ProtectedRoute: Not authenticated, navigating to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
}
