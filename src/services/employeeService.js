import { supabase } from '../lib/supabaseClient';

export async function getEmployees() {
  try {
    const { data, error } = await supabase
      .from('empleado')
      .select(`
        *,
        info_contacto(*),
        direccion(*)
      `)
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function saveEmployee(employee) {
  try {
    let contactId = null;
    let addressId = null;

    if (employee.contacto) {
      const { data: contactData, error: contactError } = await supabase
        .from('info_contacto')
        .insert([{
          telefono: employee.contacto.telefono,
          correo: employee.contacto.correo
        }])
        .select()
        .single();

      if (contactError) throw contactError;
      contactId = contactData.id;
    }

    if (employee.direccion) {
      const { data: addressData, error: addressError } = await supabase
        .from('direccion')
        .insert([{
          calle: employee.direccion.calle,
          ciudad: employee.direccion.ciudad,
          estado: employee.direccion.estado,
          codigo_postal: employee.direccion.codigo_postal
        }])
        .select()
        .single();

      if (addressError) throw addressError;
      addressId = addressData.id;
    }

    const { data, error } = await supabase
      .from('empleado')
      .insert([{
        nombres: employee.nombres,
        apellidos: employee.apellidos,
        tipo_documento: employee.tipo_documento,
        numero_documento: employee.numero_documento,
        cargo: employee.cargo,
        departamento: employee.departamento,
        codigo_empleado: employee.codigo_empleado,
        id_contacto: contactId,
        id_direccion: addressId
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving employee:', error);
    throw error;
  }
}

export async function updateEmployee(id, updatedData) {
  try {
    const { data, error } = await supabase
      .from('empleado')
      .update(updatedData)
      .eq('id', id)
      .select()
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
    const { error } = await supabase
      .from('empleado')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

export async function getAttendanceRecords() {
  try {
    const { data, error } = await supabase
      .from('registro_asistencia')
      .select(`
        *,
        empleado(nombres, apellidos, codigo_empleado)
      `)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
}

export async function getDashboardStats() {
  try {
    const { count: employeeCount } = await supabase
      .from('empleado')
      .select('*', { count: 'exact', head: true });

    const { data: departments } = await supabase
      .from('empleado')
      .select('departamento');

    const uniqueDepartments = [...new Set(departments?.map(d => d.departamento).filter(Boolean))];

    const { data: payrollData } = await supabase
      .from('registro_nomina')
      .select('salario_neto');

    const totalPayroll = payrollData?.reduce((sum, record) => sum + parseFloat(record.salario_neto || 0), 0) || 0;

    return {
      totalEmployees: employeeCount || 0,
      totalDepartments: uniqueDepartments.length || 0,
      totalPayroll: totalPayroll
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalEmployees: 0,
      totalDepartments: 0,
      totalPayroll: 0
    };
  }
}
