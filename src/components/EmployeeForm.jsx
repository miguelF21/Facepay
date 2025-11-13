import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Loader2 } from 'lucide-react';
import { createEmployee } from '../services/employeeService';

export default function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    document_type: 'DNI',
    document_number: '',
    position: '',
    department: '',
    employee_code: '',
    contact: { phone: '', email: '' },
    address: { street: '', city: '', state: '', postal_code: '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contact.')) {
      const field = name.split('.')[1];
      setForm(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.first_name || !form.last_name || !form.position || !form.department || !form.employee_code) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await createEmployee(form);
      setForm({
        first_name: '',
        last_name: '',
        document_type: 'DNI',
        document_number: '',
        position: '',
        department: '',
        employee_code: '',
        contact: { phone: '', email: '' },
        address: { street: '', city: '', state: '', postal_code: '' }
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Form error:', err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name *</label>
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name *</label>
          <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Document Type</label>
          <select name="document_type" value={form.document_type} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500">
            <option value="DNI">DNI</option>
            <option value="Passport">Passport</option>
            <option value="License">License</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Document Number</label>
          <input type="text" name="document_number" value={form.document_number} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Position *</label>
          <input type="text" name="position" value={form.position} onChange={handleChange} placeholder="e.g., Software Engineer" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department *</label>
          <input type="text" name="department" value={form.department} onChange={handleChange} placeholder="e.g., Engineering" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Employee Code *</label>
        <input type="text" name="employee_code" value={form.employee_code} onChange={handleChange} placeholder="e.g., EMP001" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" required />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input type="email" name="contact.email" value={form.contact.email} onChange={handleChange} placeholder="email@example.com" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
            <input type="tel" name="contact.phone" value={form.contact.phone} onChange={handleChange} placeholder="+1 234 567 8900" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Address</h3>
        <div className="space-y-4">
          <input type="text" name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="address.postal_code" value={form.address.postal_code} onChange={handleChange} placeholder="ZIP" className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <User className="w-5 h-5" />
            Add Employee
          </>
        )}
      </button>
    </motion.form>
  );
}
