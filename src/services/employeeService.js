import { supabase } from '../lib/supabaseClient';

// ============================================
// EMPLOYEE IMAGE UPLOAD
// ============================================

export async function uploadEmployeePhoto(file, employeeCode) {
  try {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${employeeCode}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('employee-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('employee-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
}

export async function deleteEmployeePhoto(photoUrl) {
  try {
    if (!photoUrl) return;
    
    const path = photoUrl.split('/employee-photos/')[1];
    if (!path) return;

    await supabase.storage
      .from('employee-photos')
      .remove([path]);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
}

// ============================================
// EMPLOYEE CRUD OPERATIONS
// ============================================

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

export async function createEmployee(employee, photoFile = null) {
  try {
    let contactId = null;
    let addressId = null;
    let photoUrl = null;

    // Create contact info if provided
    if (employee.contact && (employee.contact.phone || employee.contact.email)) {
      const { data: contactData, error: contactError } = await supabase
        .from('contact_info')
        .insert([{ 
          phone: employee.contact.phone || null, 
          email: employee.contact.email || null 
        }])
        .select()
        .single();
      
      if (contactError) {
        console.error('Contact error:', contactError);
        throw new Error('Failed to create contact information');
      }
      contactId = contactData.id;
    }

    // Create address if provided
    if (employee.address && (employee.address.street || employee.address.city)) {
      const { data: addressData, error: addressError } = await supabase
        .from('address')
        .insert([{ 
          street: employee.address.street || null, 
          city: employee.address.city || null, 
          state: employee.address.state || null, 
          postal_code: employee.address.postal_code || null 
        }])
        .select()
        .single();
      
      if (addressError) {
        console.error('Address error:', addressError);
        throw new Error('Failed to create address');
      }
      addressId = addressData.id;
    }

    // Upload photo if provided
    if (photoFile) {
      try {
        photoUrl = await uploadEmployeePhoto(photoFile, employee.employee_code);
      } catch (photoError) {
        console.error('Photo upload failed:', photoError);
        // Continue without photo rather than failing completely
      }
    }

    // Create employee record
    const { data, error } = await supabase
      .from('employee')
      .insert([{ 
        first_name: employee.first_name,
        last_name: employee.last_name,
        document_type: employee.document_type || 'CC',
        document_number: employee.document_number || null,
        position: employee.position,
        department: employee.department,
        employee_code: employee.employee_code,
        contact_id: contactId,
        address_id: addressId,
        photo_url: photoUrl
      }])
      .select(`*, contact_info:contact_id(*), address:address_id(*)`)
      .single();
    
    if (error) {
      console.error('Employee creation error:', error);
      throw new Error(error.message || 'Failed to create employee');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

export async function updateEmployee(id, updatedData, photoFile = null) {
  try {
    const currentEmployee = await getEmployeeById(id);
    
    if (updatedData.contact && currentEmployee.contact_id) {
      const { error: cErr } = await supabase
        .from('contact_info')
        .update({ 
          phone: updatedData.contact.phone, 
          email: updatedData.contact.email 
        })
        .eq('id', currentEmployee.contact_id);
      if (cErr) throw cErr;
    }
    
    if (updatedData.address && currentEmployee.address_id) {
      const { error: aErr } = await supabase
        .from('address')
        .update({ 
          street: updatedData.address.street, 
          city: updatedData.address.city, 
          state: updatedData.address.state, 
          postal_code: updatedData.address.postal_code 
        })
        .eq('id', currentEmployee.address_id);
      if (aErr) throw aErr;
    }

    let photoUrl = currentEmployee.photo_url;
    if (photoFile) {
      // Delete old photo if exists
      if (currentEmployee.photo_url) {
        await deleteEmployeePhoto(currentEmployee.photo_url);
      }
      // Upload new photo
      photoUrl = await uploadEmployeePhoto(photoFile, updatedData.employee_code || currentEmployee.employee_code);
    }

    const { data, error } = await supabase
      .from('employee')
      .update({ 
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        document_type: updatedData.document_type,
        document_number: updatedData.document_number,
        position: updatedData.position,
        department: updatedData.department,
        employee_code: updatedData.employee_code,
        photo_url: photoUrl
      })
      .eq('id', id)
      .select(`*, contact_info:contact_id(*), address:address_id(*)`)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id) {
  try {
    const employee = await getEmployeeById(id);
    
    // Delete photo if exists
    if (employee.photo_url) {
      await deleteEmployeePhoto(employee.photo_url);
    }
    
    await supabase.from('employee').delete().eq('id', id);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// ============================================
// ATTENDANCE OPERATIONS
// ============================================

export async function getAttendanceRecords() {
  try {
    const { data, error } = await supabase
      .from('attendance_record')
      .select(`*, employee:employee_id(id, first_name, last_name, employee_code)`)  
      .order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    throw error;
  }
}

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

export async function getPayrollRecords() {
  try {
    const { data, error } = await supabase
      .from('payroll_record')
      .select(`*, employee:employee_id(id, first_name, last_name, employee_code, department)`)  
      .order('period_start', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payroll records:', error);
    throw error;
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  try {
    const { count: employeeCount } = await supabase.from('employee').select('*', { count: 'exact', head: true });
    const { data: departments } = await supabase.from('employee').select('department');
    const uniqueDepartments = [...new Set(departments?.map((d) => d.department).filter(Boolean))];
    const { data: payrollData } = await supabase.from('payroll_record').select('net_salary');
    const totalPayroll = payrollData?.reduce((sum, r) => sum + parseFloat(r.net_salary || 0), 0) || 0;

    const today = new Date().toISOString().split('T')[0];
    const { count: presentToday } = await supabase
      .from('attendance_record')
      .select('*', { count: 'exact', head: true })
      .eq('date', today)
      .eq('status', true);

    return {
      totalEmployees: employeeCount || 0,
      totalDepartments: uniqueDepartments.length || 0,
      totalPayroll,
      presentToday: presentToday || 0,
      attendanceRate: employeeCount ? Math.round(((presentToday || 0) / employeeCount) * 100) : 0
    };
  } catch (error) {
    console.error('Stats error', error);
    return { totalEmployees: 0, totalDepartments: 0, totalPayroll: 0, presentToday: 0, attendanceRate: 0 };
  }
}

// ============================================
// SEARCH HELPERS
// ============================================

export async function searchEmployees(term) {
  const { data } = await supabase
    .from('employee')
    .select(`*, contact_info:contact_id(*), address:address_id(*)`)
    .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,employee_code.ilike.%${term}%`);
  return data || [];
}

export async function getEmployeesByDepartment(dept) {
  const { data } = await supabase
    .from('employee')
    .select(`*, contact_info:contact_id(*), address:address_id(*)`)
    .eq('department', dept);
  return data || [];
}

// ============================================
// REPORTS
// ============================================

export async function getAttendanceReport(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('attendance_record')
      .select(`*, employee:employee_id(first_name, last_name, employee_code)`)
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

export async function getPayrollReport(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('payroll_record')
      .select(`*, employee:employee_id(first_name, last_name, employee_code)`)
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
