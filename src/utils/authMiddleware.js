/**
 * Middleware de autenticación para manejar tanto Auth0 como reconocimiento facial
 */

export const checkFacialAuth = () => {
  const facialSession = localStorage.getItem('facial_auth_session');
  const authType = localStorage.getItem('auth_type');
  
  if (authType === 'facial' && facialSession) {
    try {
      const session = JSON.parse(facialSession);
      
      // Verificar que la sesión no sea muy antigua (más de 12 horas)
      const authenticatedAt = new Date(session.authenticatedAt);
      const now = new Date();
      const hoursDiff = (now - authenticatedAt) / (1000 * 60 * 60);
      
      if (hoursDiff > 12) {
        // Sesión expirada
        clearFacialAuth();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error parsing facial session:', error);
      return null;
    }
  }
  
  return null;
};

export const clearFacialAuth = () => {
  localStorage.removeItem('facial_auth_session');
  localStorage.removeItem('auth_type');
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('last_attendance');
  sessionStorage.removeItem('facial_auth_session');
  console.log('[AuthMiddleware] Sesión facial limpiada');
};

export const isAuthenticated = () => {
  // Verificar Auth0 (esto depende de tu implementación)
  // Ajusta según cómo manejes Auth0 en tu app
  const auth0Session = localStorage.getItem('auth0_session'); // Ajusta el nombre
  
  // Verificar Facial
  const facialSession = checkFacialAuth();
  
  return !!(auth0Session || facialSession);
};

export const getCurrentUser = () => {
  // Primero verificar facial (prioridad)
  const facialSession = checkFacialAuth();
  if (facialSession) {
    return {
      id: facialSession.employeeId,
      name: facialSession.name,
      email: facialSession.email,
      employeeCode: facialSession.employeeCode,
      position: facialSession.position,
      department: facialSession.department,
      type: 'facial',
      ...facialSession
    };
  }
  
  // Luego verificar Auth0
  // Ajusta según tu implementación de Auth0
  try {
    const auth0User = localStorage.getItem('auth0_user');
    if (auth0User) {
      const user = JSON.parse(auth0User);
      return {
        ...user,
        type: 'auth0'
      };
    }
  } catch (error) {
    console.error('Error parsing auth0 user:', error);
  }
  
  return null;
};

export const setFacialSession = (sessionData) => {
  localStorage.setItem('facial_auth_session', JSON.stringify(sessionData));
  localStorage.setItem('auth_type', 'facial');
  localStorage.setItem('user_authenticated', 'true');
  console.log('[AuthMiddleware] Sesión facial establecida:', sessionData.name);
};
