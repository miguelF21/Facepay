// ... existing content above remains unchanged

// ============================================
// REPORTS
// ============================================

/**
 * Get attendance records within a date range
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate   - YYYY-MM-DD
 */
export async function getAttendanceReport(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('attendance_record')
      .select(`
        *,
        employee:employee_id(
          first_name,
          last_name,
          employee_code
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance report:', error);
    throw error;
  }
}

/**
 * Get payroll records within a date range
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate   - YYYY-MM-DD
 */
export async function getPayrollReport(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('payroll_record')
      .select(`
        *,
        employee:employee_id(
          first_name,
          last_name,
          employee_code
        )
      `)
      .gte('period_start', startDate)
      .lte('period_end', endDate)
      .order('period_start', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payroll report:', error);
    throw error;
  }
}
