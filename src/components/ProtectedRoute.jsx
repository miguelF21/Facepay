import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { checkFacialAuth } from '../utils/authMiddleware';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // Verificar autenticación facial
  const facialSession = checkFacialAuth();
  
  // Si Auth0 está cargando, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }
  
  // Permitir acceso si está autenticado por Auth0 O por reconocimiento facial
  const hasAccess = isAuthenticated || facialSession;
  
  console.log('[ProtectedRoute] isAuthenticated (Auth0):', isAuthenticated);
  console.log('[ProtectedRoute] facialSession:', !!facialSession);
  console.log('[ProtectedRoute] hasAccess:', hasAccess);
  
  return hasAccess ? children : <Navigate to="/" replace />;
}
