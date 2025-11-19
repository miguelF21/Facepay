// src/services/employeeService.js
import { http } from '../lib/mongoClient';

// ==================== EMPLOYEES ====================

/**
 * Obtener todos los empleados activos
 * Alias: getEmployees (para compatibilidad)
 */
export async function getAllEmployees() {
  try {
    const { data } = await http.get('/employees');
    return { 
      data: data?.data ?? [], 
      error: null,
      count: data?.count ?? 0
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { 
      data: [], 
      error: error.response?.data?.error || 'Error al obtener empleados' 
    };
  }
}

// Alias para compatibilidad con código existente
export const getEmployees = getAllEmployees;

/**
 * Obtener un empleado por código
 */
export async function getEmployeeByCode(employeeCode) {
  try {
    const { data } = await http.get(`/employees/${employeeCode}`);
    return { 
      data: data?.data ?? null, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Empleado no encontrado' 
    };
  }
}

/**
 * Crear un nuevo empleado
 */
export async function createEmployee(employeeData) {
  try {
    const { data } = await http.post('/employees', employeeData);
    return { 
      data: data?.data ?? null, 
      error: null 
    };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Error al crear empleado' 
    };
  }
}

/**
 * Actualizar un empleado existente
 */
export async function updateEmployee(employeeCode, updates) {
  try {
    const { data } = await http.put(`/employees/${employeeCode}`, updates);
    return { 
      data: data?.data ?? null, 
      error: null 
    };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Error al actualizar empleado' 
    };
  }
}

/**
 * Eliminar un empleado (soft delete)
 */
export async function deleteEmployee(employeeCode) {
  try {
    const { data } = await http.delete(`/employees/${employeeCode}`);
    return { 
      data: data?.success ?? false, 
      error: null 
    };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { 
      data: false, 
      error: error.response?.data?.error || 'Error al eliminar empleado' 
    };
  }
}

/**
 * Buscar empleados por término
 */
export async function searchEmployees(searchTerm) {
  try {
    const { data } = await http.get('/employees', {
      params: { search: searchTerm }
    });
    
    // Si la API no soporta búsqueda, filtrar localmente
    const employees = data?.data ?? [];
    const filtered = employees.filter(emp => 
      emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code?.includes(searchTerm) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return { 
      data: filtered, 
      error: null 
    };
  } catch (error) {
    console.error('Error searching employees:', error);
    return { 
      data: [], 
      error: error.response?.data?.error || 'Error al buscar empleados' 
    };
  }
}

/**
 * Obtener empleados por departamento
 */
export async function getEmployeesByDepartment(department) {
  try {
    const { data } = await http.get('/employees', {
      params: { department }
    });
    
    // Si la API no soporta filtro, filtrar localmente
    const employees = data?.data ?? [];
    const filtered = employees.filter(emp => emp.department === department);
    
    return { 
      data: filtered, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching employees by department:', error);
    return { 
      data: [], 
      error: error.response?.data?.error || 'Error al obtener empleados' 
    };
  }
}

/**
 * Subir foto de empleado
 */
export async function uploadPhoto(employeeCode, photoFile) {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/employees/${employeeCode}/photo`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return { 
      data: data?.data ?? null, 
      error: data?.success ? null : 'Error al subir foto' 
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return { 
      data: null, 
      error: 'Error al subir foto' 
    };
  }
}

// ==================== ATTENDANCE ====================

/**
 * Obtener registros de asistencia
 */
export async function getAttendanceRecords(filters = {}) {
  try {
    const { data } = await http.get('/attendance', { params: filters });
    return { 
      data: data?.data ?? [], 
      error: null,
      count: data?.count ?? 0
    };
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return { 
      data: [], 
      error: error.response?.data?.error || 'Error al obtener registros' 
    };
  }
}

/**
 * Crear registro de asistencia
 */
export async function createAttendanceRecord(record) {
  try {
    const { data } = await http.post('/attendance', record);
    return { 
      data: data?.data ?? null, 
      error: null 
    };
  } catch (error) {
    console.error('Error creating attendance:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Error al crear registro' 
    };
  }
}

/**
 * Obtener reporte de asistencia
 */
export async function getAttendanceReport(filters = {}) {
  try {
    const { data } = await http.get('/attendance', { params: filters });
    
    // Procesar datos para el reporte
    const records = data?.data ?? [];
    const report = {
      total_records: records.length,
      complete: records.filter(r => r.status === 'complete').length,
      incomplete: records.filter(r => r.status === 'incomplete').length,
      records: records
    };
    
    return { 
      data: report, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Error al obtener reporte' 
    };
  }
}

// ==================== PAYROLL ====================

/**
 * Obtener registros de nómina
 */
export async function getPayrollRecords(filters = {}) {
  try {
    const { data } = await http.get('/payroll', { params: filters });
    return { 
      data: data?.data ?? [], 
      error: null,
      count: data?.count ?? 0
    };
  } catch (error) {
    console.error('Error fetching payroll:', error);
    return { 
      data: [], 
      error: error.response?.data?.error || 'Error al obtener nómina' 
    };
  }
}

/**
 * Calcular nómina
 */
export async function calculatePayroll(period) {
  try {
    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
      return { 
        data: null, 
        error: 'Formato de período inválido. Use YYYY-MM' 
      };
    }

    const { data } = await http.post('/payroll/calculate', { period });
    return { 
      data: data?.data ?? [], 
      error: null,
      message: data?.message || 'Nómina calculada exitosamente'
    };
  } catch (error) {
    console.error('Error calculating payroll:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Error al calcular nómina' 
    };
  }
}

/**
 * Obtener reporte de nómina
 */
export async function getPayrollReport(filters = {}) {
  try {
    const { data } = await http.get('/payroll', { params: filters });
    
    // Procesar datos para el reporte
    const records = data?.data ?? [];
    const report = {
      total_records: records.length,
      total_gross: records.reduce((sum, r) => sum + (r.gross_salary || 0), 0),
      total_deductions: records.reduce((sum, r) => sum + (r.total_deductions || 0), 0),
      total_net: records.reduce((sum, r) => sum + (r.net_salary || 0), 0),
      records: records
    };
    
    return { 
      data: report, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching payroll report:', error);
    return { 
      data: null, 
      error: error.response?.data?.error || 'Error al obtener reporte' 
    };
  }
}

// ==================== DASHBOARD ====================

/**
 * Obtener estadísticas del dashboard
 */
export async function getDashboardStats() {
  try {
    const { data } = await http.get('/dashboard/stats');
    return { 
      data: data?.data ?? null, 
      error: null 
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    
    // Fallback: calcular estadísticas manualmente
    try {
      const employees = await getAllEmployees();
      const today = new Date().toISOString().split('T')[0];
      const attendance = await getAttendanceRecords({ 
        date_from: today, 
        date_to: today 
      });
      
      const stats = {
        total_employees: employees.data?.length ?? 0,
        today_attendance: attendance.data?.length ?? 0,
        present_now: attendance.data?.filter(r => r.check_in && !r.check_out).length ?? 0,
        absent_today: (employees.data?.length ?? 0) - (attendance.data?.length ?? 0)
      };
      
      return { data: stats, error: null };
    } catch (fallbackError) {
      return { 
        data: null, 
        error: 'Error al obtener estadísticas' 
      };
    }
  }
}

// ==================== EXPORT DEFAULT ====================

export const employeeService = {
  // Employees
  getAllEmployees,
  getEmployees,
  getEmployeeByCode,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeesByDepartment,
  uploadPhoto,
  
  // Attendance
  getAttendanceRecords,
  createAttendanceRecord,
  getAttendanceReport,
  
  // Payroll
  getPayrollRecords,
  calculatePayroll,
  getPayrollReport,
  
  // Dashboard
  getDashboardStats
};

export default employeeService;
