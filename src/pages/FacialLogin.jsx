import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function FacialLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const token = searchParams.get('token');
    const employeeId = searchParams.get('employee_id');

    if (!token || !employeeId) {
      setStatus('Acceso denegado');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // Verificar token y autenticar
    authenticateFacial(token, employeeId);
  }, [searchParams, navigate]);

  const authenticateFacial = async (token, employeeId) => {
    try {
      // Validar token (puedes agregar tabla de tokens temporales)
      const { data: employee, error } = await supabase
        .from('employee')
        .select('*, user_account(*)')
        .eq('id', employeeId)
        .single();

      if (error || !employee) {
        throw new Error('Empleado no encontrado');
      }

      // Crear sesión temporal o usar Auth0
      // Por ahora, guardamos en localStorage para simular sesión
      localStorage.setItem('facial_auth_session', JSON.stringify({
        employeeId: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.user_account?.email,
        timestamp: new Date().toISOString()
      }));

      setStatus('✓ Autenticación exitosa. Redirigiendo...');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error en autenticación facial:', error);
      setStatus('Error en autenticación');
      setTimeout(() => navigate('/'), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
        <div className="mb-4">
          <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Reconocimiento Facial</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
