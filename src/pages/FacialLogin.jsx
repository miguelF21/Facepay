import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setFacialSession } from '../utils/authMiddleware';

export default function FacialLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando autenticación facial...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const token = searchParams.get('token');
    const employeeId = searchParams.get('employee_id');

    console.log('[FacialLogin] Token:', token);
    console.log('[FacialLogin] Employee ID:', employeeId);

    if (!token || !employeeId) {
      setStatus('❌ Acceso denegado - Datos incompletos');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // Iniciar animación de progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    authenticateFacial(token, employeeId, progressInterval);
  }, [searchParams, navigate]);

  const authenticateFacial = async (token, employeeId, progressInterval) => {
    try {
      setStatus('Validando identidad...');
      
      // 1. Verificar que el empleado existe en Supabase
      const { data: employee, error: employeeError } = await supabase
        .from('employee')
        .select('*, user_account(*), contact_info(*)')
        .eq('id', employeeId)
        .single();

      if (employeeError || !employee) {
        throw new Error('Empleado no encontrado en la base de datos');
      }

      console.log('[FacialLogin] Empleado encontrado:', employee);

      setProgress(50);
      setStatus('Creando sesión segura...');

      // 2. Crear sesión de reconocimiento facial
      const facialSession = {
        type: 'facial_recognition',
        employeeId: employee.id,
        userId: employee.user_id,
        name: `${employee.first_name} ${employee.last_name}`,
        email: employee.user_account?.email || `employee_${employee.employee_code}@facepay.local`,
        employeeCode: employee.employee_code,
        position: employee.position,
        department: employee.department,
        contact: employee.contact_info,
        authenticatedAt: new Date().toISOString(),
        token: token
      };

      // 3. Guardar sesión usando el middleware
      setFacialSession(facialSession);

      console.log('[FacialLogin] Sesión creada:', facialSession);

      setProgress(80);
      setStatus('Verificando último registro de asistencia...');

      // 4. Obtener el último registro de asistencia
      const today = new Date().toISOString().split('T')[0];
      const { data: lastAttendance } = await supabase
        .from('attendance_record')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('date', today)
        .order('check_in', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastAttendance) {
        console.log('[FacialLogin] Último registro hoy:', lastAttendance);
        localStorage.setItem('last_attendance', JSON.stringify(lastAttendance));
      }

      clearInterval(progressInterval);
      setProgress(100);
      setStatus('✓ Autenticación exitosa. Bienvenido!');

      // 5. Esperar 1.5 segundos y redirigir al dashboard
      setTimeout(() => {
        console.log('[FacialLogin] Redirigiendo a dashboard...');
        navigate('/dashboard', { replace: true });
      }, 1500);

    } catch (error) {
      clearInterval(progressInterval);
      console.error('[FacialLogin] Error:', error);
      setStatus(`❌ Error: ${error.message}`);
      setProgress(0);
      
      // Redirigir al home después de 4 segundos
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 4000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Logo o Icono */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Reconocimiento Facial</h1>
          <p className="text-sm text-gray-500 mt-2">Autenticación Biométrica</p>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">{progress}%</p>
        </div>

        {/* Estado */}
        <div className="text-center">
          <p className="text-gray-700 text-lg font-medium">{status}</p>
          
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
            </div>
          )}

          {progress === 100 && (
            <div className="mt-4">
              <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}

          {progress === 0 && status.includes('Error') && (
            <div className="mt-4">
              <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Información Adicional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Ingreso mediante reconocimiento facial biométrico
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Sistema FacePay - Seguro y confiable
          </p>
        </div>
      </div>
    </div>
  );
}
