// src/services/attendanceService.js
import { http } from '../lib/mongoClient';

export const attendanceService = {
  /**
   * Obtener registros de asistencia con filtros opcionales
   * @param {Object} filters - { employee_id, date_from, date_to }
   */
  async getAttendanceRecords(filters = {}) {
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
        error: error.response?.data?.error || 'Error al obtener registros de asistencia' 
      };
    }
  },

  /**
   * Crear registro de asistencia manual
   * @param {Object} record - { employee_id, date, check_in, check_out, notes }
   */
  async createAttendanceRecord(record) {
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
        error: error.response?.data?.error || 'Error al crear registro de asistencia' 
      };
    }
  },

  /**
   * Obtener estadísticas de asistencia del día
   */
  async getTodayStats() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await http.get('/attendance', { 
        params: { date_from: today, date_to: today } 
      });
      return { 
        data: data?.data ?? [], 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching today stats:', error);
      return { 
        data: [], 
        error: error.response?.data?.error || 'Error al obtener estadísticas' 
      };
    }
  },

  /**
   * Obtener registros de asistencia de un empleado específico
   */
  async getEmployeeAttendance(employeeId, dateFrom, dateTo) {
    try {
      const { data } = await http.get('/attendance', { 
        params: { 
          employee_id: employeeId,
          date_from: dateFrom,
          date_to: dateTo
        } 
      });
      return { 
        data: data?.data ?? [], 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      return { 
        data: [], 
        error: error.response?.data?.error || 'Error al obtener asistencia del empleado' 
      };
    }
  }
};

export default attendanceService;
