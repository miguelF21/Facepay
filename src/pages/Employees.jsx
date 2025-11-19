import { useState, useEffect } from 'react';
import { 
  getAllEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  uploadPhoto 
} from '../services/employeeService';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllEmployees();

      if (response.error) {
        throw new Error(response.error);
      }

      let employeesArray = [];
      if (response.data) {
        employeesArray = Array.isArray(response.data) 
          ? response.data 
          : Object.values(response.data);
      }

      setEmployees(employeesArray);

    } catch (err) {
      console.error('Error loading employees:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEmployee(employeeData) {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.employee_code, employeeData);
      } else {
        await createEmployee(employeeData);
      }
      setShowModal(false);
      setEditingEmployee(null);
      loadEmployees();
    } catch (err) {
      alert('Error saving employee: ' + err.message);
    }
  }

  async function handleDeleteEmployee(employeeCode) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await deleteEmployee(employeeCode);
      loadEmployees();
    } catch (err) {
      alert('Error deleting employee: ' + err.message);
    }
  }

  async function handlePhotoUpload(employeeCode, file) {
    try {
      setUploadingPhoto(employeeCode);
      await uploadPhoto(employeeCode, file);
      loadEmployees();
    } catch (err) {
      alert('Error uploading photo: ' + err.message);
    } finally {
      setUploadingPhoto(null);
    }
  }

  const filteredEmployees = employees.filter(emp =>
    (emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (emp.employee_code?.includes(searchTerm)) ||
    (emp.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Employees
            </h1>
            <p className="text-gray-600 mt-2">Manage your workforce</p>
          </div>
          <button
            onClick={() => { setEditingEmployee(null); setShowModal(true); }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            + Add Employee
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee._id || employee.employee_code} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="absolute -bottom-0 left-25">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                      {employee.biometric_data?.facial_image_url ? (
                        <img 
                          src={employee.biometric_data.facial_image_url} 
                          alt={employee.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-gray-400">
                          {(employee.first_name || 'N').charAt(0)}
                        </span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handlePhotoUpload(employee.employee_code, e.target.files[0])}
                        disabled={uploadingPhoto === employee.employee_code}
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-16 px-6 pb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {employee.first_name} {employee.last_name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{employee.position || 'No position'}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    {employee.email || 'No email'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                    </svg>
                    ID: {employee.employee_code}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingEmployee(employee); setShowModal(true); }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEmployee(employee.employee_code)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p className="text-gray-500 text-lg">No employees found</p>
          </div>
        )}
      </div>

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => { setShowModal(false); setEditingEmployee(null); }}
          onSave={handleSaveEmployee}
        />
      )}
    </div>
  );
}

function EmployeeModal({ employee, onClose, onSave }) {
  const [formData, setFormData] = useState(employee || {
    employee_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    position: '',
    department: '',
    salary: '',
    contract_type: 'Indefinido',
    document_type: 'CC',
    document_number: ''
  });
  
  const [ageError, setAgeError] = useState('');

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'birth_date') {
      validateAge(value);
    }
  }

  function validateAge(birthDate) {
    if (!birthDate) {
      setAgeError('');
      return false;
    }

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      setAgeError(`Employee must be at least 18 years old. Current age: ${age} years`);
      return false;
    }

    setAgeError('');
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (formData.birth_date && !validateAge(formData.birth_date)) {
      alert('Employee must be at least 18 years old');
      return;
    }
    
    onSave(formData);
  }

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 18);
  const maxDateString = maxBirthDate.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                required
                value={formData.employee_code}
                onChange={(e) => handleChange('employee_code', e.target.value)}
                disabled={!!employee}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Number *</label>
              <input
                type="text"
                required
                value={formData.document_number}
                onChange={(e) => handleChange('document_number', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Date * (Must be 18+ years)
              </label>
              <input
                type="date"
                required
                value={formData.birth_date}
                onChange={(e) => handleChange('birth_date', e.target.value)}
                max={maxDateString}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  ageError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {ageError && (
                <p className="text-red-500 text-sm mt-1 font-semibold">{ageError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!ageError}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Employees;
