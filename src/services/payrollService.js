// src/services/payrollService.js
import { http } from '../lib/mongoClient';

export const payrollService = {
  /**
   * Obtener registros de nómina
   * @param {Object} filters - { period, employee_id }
   */
  async getPayrollRecords(filters = {}) {
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
        error: error.response?.data?.error || 'Error al obtener registros de nómina' 
      };
    }
  },

  /**
   * Calcular nómina de un período
   * @param {string} period - Formato: "YYYY-MM" (ej: "2024-11")
   */
  async calculatePayroll(period) {
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
  },

  /**
   * Obtener nómina de un empleado específico
   */
  async getEmployeePayroll(employeeId, period = null) {
    try {
      const filters = { employee_id: employeeId };
      if (period) filters.period = period;

      const { data } = await http.get('/payroll', { params: filters });
      return { 
        data: data?.data ?? [], 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching employee payroll:', error);
      return { 
        data: [], 
        error: error.response?.data?.error || 'Error al obtener nómina del empleado' 
      };
    }
  },

  /**
   * Obtener resumen de nómina del mes actual
   */
  async getCurrentMonthSummary() {
    try {
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const { data } = await http.get('/payroll', { params: { period } });
      return { 
        data: data?.data ?? [], 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching current month summary:', error);
      return { 
        data: [], 
        error: error.response?.data?.error || 'Error al obtener resumen del mes' 
      };
    }
  }
};

export default payrollService;
