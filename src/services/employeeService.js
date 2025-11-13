import { supabase } from '../lib/supabaseClient';

// ============================================
// EMPLOYEE CRUD OPERATIONS
// ============================================

/**
 * Fetch all employees with their contact and address information
 * @returns {Promise<Array>} Array of employee objects
 */
export async function getEmployees() {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select(`
        *,
        contact_info:contact_id(*),
        address:address_id(*)
      `)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

/**
 * Get a single employee by ID
 * @param {number} id - Employee ID
 * @returns {Promise<Object>} Employee object
 */
export async function getEmployeeById(id) {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select(`
        *,
        contact_info:contact_id(*),
        address:address_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw error;
  }
}

/**
 * Create a new employee with contact and address information
 * @param {Object} employee - Employee data object
 * @returns {Promise<Object>} Created employee object
 */
export async function createEmployee(employee) {
  try {
    let contactId = null;
    let addressId = null;

    // Create contact info if provided
    if (employee.contact) {
      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .insert([{
          phone: employee.contact.phone,
          email: employee.contact.email
        }])
        .select()
        .single();

      if (contactError) throw contactError;
      contactId = contactData.id;
    }

    // Create address if provided
    if (employee.address) {
      const { data: addressData, error: addressError } = await supabase
        .from('address')
        .insert([{
          street: employee.address.street,
          city: employee.address.city,
          state: employee.address.state,
          postal_code: employee.address.postal_code
        }])
        .select()
        .single();

      if (addressError) throw addressError;
      addressId = addressData.id;
    }

    // Create employee
    const { data, error } = await supabase
      .from('employee')
      .insert([{
        first_name: employee.first_name,
        last_name: employee.last_name,
        document_type: employee.document_type,
        document_number: employee.document_number,
        position: employee.position,
        department: employee.department,
        employee_code: employee.employee_code,
        contact_id: contactId,
        address_id: addressId
      }])
      .select(`
        *,
        contact_info:contact_id(*),
        address:address_id(*)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

/**
 * Update an existing employee
 * @param {number} id - Employee ID
 * @param {Object} updatedData - Updated employee data
 * @returns {Promise<Object>} Updated employee object
 */
export async function updateEmployee(id, updatedData) {
  try {
    // Update contact info if provided
    if (updatedData.contact && updatedData.contact_id) {
      const { error: contactError } = await supabase
        .from('contact_info')
        .update({
          phone: updatedData.contact.phone,
          email: updatedData.contact.email
        })
        .eq('id', updatedData.contact_id);

      if (contactError) throw contactError;
    }

    // Update address if provided
    if (updatedData.address && updatedData.address_id) {
      const { error: addressError } = await supabase
        .from('address')
        .update({
          street: updatedData.address.street,
          city: updatedData.address.city,
          state: updatedData.address.state,
          postal_code: updatedData.address.postal_code
        })
        .eq('id', updatedData.address_id);

      if (addressError) throw addressError;
    }

    // Update employee
    const { data, error } = await supabase
      .from('employee')
      .update({
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        document_type: updatedData.document_type,
        document_number: updatedData.document_number,
        position: updatedData.position,
        department: updatedData.department,
        employee_code: updatedData.employee_code
      })
      .eq('id', id)
      .select(`
        *,
        contact_info:contact_id(*),
        address:address_id(*)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

/**
 * Delete an employee and their associated contact/address records
 * @param {number} id - Employee ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteEmployee(id) {
  try {
    // Get employee to find associated contact and address IDs
    const employee = await getEmployeeById(id);
    
    // Delete employee (this will cascade delete contact and address due to ON DELETE CASCADE)
    const { error } = await supabase
      .from('employee')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// ============================================
// ATTENDANCE OPERATIONS
// ============================================

/**
 * Get all attendance records with employee information
 * @returns {Promise<Array>} Array of attendance records
 */
export async function getAttendanceRecords() {
  try {
    const { data, error } = await supabase
      .from('attendance_record')
      .select(`
        *,
        employee:employee_id(
          id,
          first_name,
          last_name,
          employee_code
        )
      `)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

/**
 * Get attendance records for a specific employee
 * @param {number} employeeId - Employee ID
 * @returns {Promise<Array>} Array of attendance records
 */
export async function getEmployeeAttendance(employeeId) {
  try {
    const { data, error } = await supabase
      .from('attendance_record')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    throw error;
  }
}

/**
 * Create a new attendance record
 * @param {Object} record - Attendance record data
 * @returns {Promise<Object>} Created attendance record
 */
export async function createAttendanceRecord(record) {
  try {
    const { data, error } = await supabase
      .from('attendance_record')
      .insert([{
        employee_id: record.employee_id,
        date: record.date,
        check_in: record.check_in,
        check_out: record.check_out,
        source_terminal: record.source_terminal,
        status: record.status ?? true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating attendance record:', error);
    throw error;
  }
}

// ============================================
// PAYROLL OPERATIONS
// ============================================

/**
 * Get all payroll records with employee information
 * @returns {Promise<Array>} Array of payroll records
 */
export async function getPayrollRecords() {
  try {
    const { data, error } = await supabase
      .from('payroll_record')
      .select(`
        *,
        employee:employee_id(
          id,
          first_name,
          last_name,
          employee_code,
          position,
          department
        )
      `)
      .order('period_start', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payroll records:', error);
    throw error;
  }
}

/**
 * Get payroll records for a specific employee
 * @param {number} employeeId - Employee ID
 * @returns {Promise<Array>} Array of payroll records
 */
export async function getEmployeePayroll(employeeId) {
  try {
    const { data, error } = await supabase
      .from('payroll_record')
      .select('*')
      .eq('employee_id', employeeId)
      .order('period_start', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employee payroll:', error);
    throw error;
  }
}

/**
 * Create a new payroll record
 * @param {Object} payroll - Payroll data
 * @returns {Promise<Object>} Created payroll record
 */
export async function createPayrollRecord(payroll) {
  try {
    const { data, error } = await supabase
      .from('payroll_record')
      .insert([{
        employee_id: payroll.employee_id,
        period_start: payroll.period_start,
        period_end: payroll.period_end,
        gross_salary: payroll.gross_salary,
        deductions: payroll.deductions,
        net_salary: payroll.net_salary
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payroll record:', error);
    throw error;
  }
}

// ============================================
// DASHBOARD STATISTICS
// ============================================

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats object
 */
export async function getDashboardStats() {
  try {
    // Get total employees count
    const { count: employeeCount, error: empError } = await supabase
      .from('employee')
      .select('*', { count: 'exact', head: true });

    if (empError) throw empError;

    // Get unique departments
    const { data: departments, error: deptError } = await supabase
      .from('employee')
      .select('department');

    if (deptError) throw deptError;

    const uniqueDepartments = [...new Set(
      departments?.map(d => d.department).filter(Boolean)
    )];

    // Get total payroll
    const { data: payrollData, error: payError } = await supabase
      .from('payroll_record')
      .select('net_salary');

    if (payError) throw payError;

    const totalPayroll = payrollData?.reduce(
      (sum, record) => sum + parseFloat(record.net_salary || 0), 
      0
    ) || 0;

    // Get today's attendance count
    const today = new Date().toISOString().split('T')[0];
    const { count: todayAttendance, error: attError } = await supabase
      .from('attendance_record')
      .select('*', { count: 'exact', head: true })
      .eq('date', today);

    if (attError) throw attError;

    return {
      totalEmployees: employeeCount || 0,
      totalDepartments: uniqueDepartments.length || 0,
      totalPayroll: totalPayroll,
      todayAttendance: todayAttendance || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalEmployees: 0,
      totalDepartments: 0,
      totalPayroll: 0,
      todayAttendance: 0
    };
  }
}

// ============================================
// SEARCH AND FILTER OPERATIONS
// ============================================

/**
 * Search employees by name or employee code
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} Array of matching employees
 */
export async function searchEmployees(searchTerm) {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select(`
        *,
        contact_info:contact_id(*),
        address:address_id(*)
      `)
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,employee_code.ilike.%${searchTerm}%`)
      .order('first_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching employees:', error);
    throw error;
  }
}

/**
 * Filter employees by department
 * @param {string} department - Department name
 * @returns {Promise<Array>} Array of employees in department
 */
export async function getEmployeesByDepartment(department) {
  try {
    const { data, error } = await supabase
      .from('employee')
      .select(`
        *,
        contact_info:contact_id(*),
        address:address_id(*)
      `)
      .eq('department', department)
      .order('first_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees by department:', error);
    throw error;
  }
}
