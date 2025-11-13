import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Loader2, Upload, X, Camera, DollarSign } from 'lucide-react';
import { createEmployee } from '../services/employeeService';

export default function EmployeeForm({ onSuccess }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    document_type: 'CC',
    document_number: '',
    position: '',
    department: '',
    employee_code: '',
    salary: '',
    contact: { phone: '', email: '' },
    address: { street: '', city: '', state: '', postal_code: '' }
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.first_name || !form.last_name || !form.position || !form.department || !form.employee_code) {
      setError('Please fill all required fields (*)');
      return;
    }

    setLoading(true);
    try {
      await createEmployee(form, photoFile);
      setForm({
        first_name: '',
        last_name: '',
        document_type: 'CC',
        document_number: '',
        position: '',
        department: '',
        employee_code: '',
        salary: '',
        contact: { phone: '', email: '' },
        address: { street: '', city: '', state: '', postal_code: '' }
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Form error:', err);
      setError(err.message || 'Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Photo Upload Section */}
      <div className="flex flex-col items-center space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Employee Photo</h3>
        
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-4 border-dashed border-slate-300 dark:border-slate-600">
            <Camera className="w-16 h-16 text-slate-400" />
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200 flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          {photoPreview ? 'Change Photo' : 'Upload Photo'}
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Formats: JPG, PNG, GIF (Max 5MB)
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-700">
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              First Name *
            </label>
            <input 
              type="text" 
              name="first_name" 
              value={form.first_name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="Enter first name"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Last Name *
            </label>
            <input 
              type="text" 
              name="last_name" 
              value={form.last_name} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="Enter last name"
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Document Type
            </label>
            <select 
              name="document_type" 
              value={form.document_type} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="CC">CC (Citizenship Card)</option>
              <option value="TI">TI (Identity Card)</option>
              <option value="CE">CE (Foreign ID)</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Document Number
            </label>
            <input 
              type="text" 
              name="document_number" 
              value={form.document_number} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="e.g., 1122509143"
            />
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-700">
          Employment Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Position *
            </label>
            <input 
              type="text" 
              name="position" 
              value={form.position} 
              onChange={handleChange} 
              placeholder="e.g., Frontend Developer" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Department *
            </label>
            <input 
              type="text" 
              name="department" 
              value={form.department} 
              onChange={handleChange} 
              placeholder="e.g., Software Development" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
          </div>
        </div>

        {/* Salary Row (Icon with clear padding) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Employee Code *
            </label>
            <input 
              type="text" 
              name="employee_code" 
              value={form.employee_code} 
              onChange={handleChange} 
              placeholder="e.g., EMP001 or 815538" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              required 
            />
          </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Monthly Salary
          </label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4 pointer-events-none" />
            <input 
              type="number" 
              name="salary" 
              value={form.salary} 
              onChange={handleChange} 
              placeholder="e.g., 3500000" 
              min="0"
              step="0.01"
              className="w-full pl-9 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-bold tracking-wider" 
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter monthly salary amount
          </p>
        </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-700">
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Email
            </label>
            <input 
              type="email" 
              name="contact.email" 
              value={form.contact.email} 
              onChange={handleChange} 
              placeholder="email@example.com" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Phone
            </label>
            <input 
              type="tel" 
              name="contact.phone" 
              value={form.contact.phone} 
              onChange={handleChange} 
              placeholder="+57 312 345 6789" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-200 dark:border-slate-700">
          Address
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Street
          </label>
          <input 
            type="text" 
            name="address.street" 
            value={form.address.street} 
            onChange={handleChange} 
            placeholder="Street 123 #45-67" 
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              City
            </label>
            <input 
              type="text" 
              name="address.city" 
              value={form.address.city} 
              onChange={handleChange} 
              placeholder="Villavicencio" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              State
            </label>
            <input 
              type="text" 
              name="address.state" 
              value={form.address.state} 
              onChange={handleChange} 
              placeholder="Meta" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Postal Code
            </label>
            <input 
              type="text" 
              name="address.postal_code" 
              value={form.address.postal_code} 
              onChange={handleChange} 
              placeholder="501031" 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Employee...
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
