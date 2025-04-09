import React from 'react';
import { useFrappeAuth } from 'frappe-react-sdk';
import { Navigate } from 'react-router-dom';

const AuthMiddleware = ({ children }) => {
  const { currentUser, isLoading } = useFrappeAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser === 'Guest') {
    window.location.href = `/login?redirect-to=${window.location.pathname}`;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
