import { http } from '../lib/mongoClient';

export const facialRecognitionService = {
  async syncEmployee(employeeCode) {
    try {
      const { data } = await http.post('/facial-recognition/sync', {
        employee_code: employeeCode
      });
      return { 
        data: data?.data ?? null, 
        error: null,
        message: data?.message
      };
    } catch (error) {
      console.error('Error syncing employee:', error);
      return { 
        data: null, 
        error: error.response?.data?.error || 'Sync failed' 
      };
    }
  },

  async getRecognitionAttempts(employeeId = null) {
    try {
      const params = employeeId ? { employee_id: employeeId } : {};
      const { data } = await http.get('/access-attempts', { params });
      return { 
        data: data?.data ?? [], 
        error: null 
      };
    } catch (error) {
      console.error('Error fetching attempts:', error);
      return { 
        data: [], 
        error: error.response?.data?.error || 'Failed to fetch attempts' 
      };
    }
  }
};

export default facialRecognitionService;
