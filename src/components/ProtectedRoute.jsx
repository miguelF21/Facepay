import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';


export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // PRIMERO: Verificar token facial
  const facialToken = localStorage.getItem('facepay_auth_token');
  const facialAuthType = localStorage.getItem('facepay_auth_type');
  
  // Si hay token facial válido, dar acceso inmediatamente
  if (facialToken && facialAuthType === 'facial') {
    return children;
  }
  
  // SEGUNDO: Verificar Auth0
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Si está autenticado con Auth0, dar acceso
  if (isAuthenticated) {
    return children;
  }
  
  // Si no está autenticado de ninguna forma, redirigir
  return <Navigate to="/" replace />;
}
