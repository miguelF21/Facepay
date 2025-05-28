// EmployeeForm.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function EmployeeForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    position: "",
    dateOfBirth: "", // Changed from 'age' to 'dateOfBirth'
    salary: "",
    email: "",
    phone: "",
    address: "",
    hireDate: "",
    photo: null, // Stores File object for local upload
    photoPreviewUrl: "", // Stores URL for preview
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation for image type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (e.g., JPEG, PNG, GIF).');
        setForm({ ...form, photo: null, photoPreviewUrl: "" });
        return;
      }
      // Read file as Data URL for preview and storage in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: file, photoPreviewUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, photo: null, photoPreviewUrl: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- Validations ---
    if (!form.name || !form.position || !form.hireDate || !form.salary || !form.dateOfBirth) {
      alert("Please fill in all required fields (Full Name, Position, Date of Birth, Hire Date, Salary).");
      return;
    }

    // Validate Age (must be 18 or older based on dateOfBirth)
    const today = new Date();
    const birthDate = new Date(form.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      alert("Employee must be at least 18 years old.");
      return;
    }

    // Validate Hire Date (cannot be in the future)
    const hireDate = new Date(form.hireDate);
    // Set both dates to start of day to compare correctly without time issues
    today.setHours(0, 0, 0, 0);
    hireDate.setHours(0, 0, 0, 0);
    if (hireDate > today) {
      alert("Hire date cannot be in the future.");
      return;
    }

    // Add new employee with unique ID, default departure reason, and departure state
    onAdd({
      ...form,
      id: Date.now(),
      age: age, // Store calculated age for display
      salary: parseFloat(form.salary), // Ensure salary is a number
      photoUrl: form.photoPreviewUrl, // Use the base64 URL for storage
      isDeparted: false, // New field: initially false
      departureDate: null, // New field
      reinstatementDate: null, // New field
      timeOutside: null, // New field to store calculated time outside
    });

    // Reset form
    setForm({
      name: "",
      position: "",
      dateOfBirth: "",
      salary: "",
      email: "",
      phone: "",
      address: "",
      hireDate: "",
      photo: null,
      photoPreviewUrl: "",
    });
  };

  const todayDateString = new Date().toISOString().split('T')[0]; // Get today's date for hireDate max
  const minBirthDate = new Date();
  minBirthDate.setFullYear(minBirthDate.getFullYear() - 18);
  const maxBirthDateString = minBirthDate.toISOString().split('T')[0]; // Max date for 18+ years old

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Full Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g., Jane Doe"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Position Field */}
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Position <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="position"
          id="position"
          value={form.position}
          onChange={handleChange}
          placeholder="e.g., Software Engineer"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Date of Birth Field */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          value={form.dateOfBirth}
          onChange={handleChange}
          // Set max date for age validation (employee must be 18+)
          max={maxBirthDateString}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Salary Field */}
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
          Salary <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="salary"
          id="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="e.g., 50000"
          step="0.01" // Allow decimal for salary
          min="0"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          placeholder="e.g., jane.doe@example.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="e.g., +1234567890"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Address Field */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={form.address}
          onChange={handleChange}
          placeholder="e.g., 123 Main St, Anytown"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Hire Date Field */}
      <div>
        <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-1">
          Hire Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="hireDate"
          id="hireDate"
          value={form.hireDate}
          onChange={handleChange}
          max={todayDateString} // Max date is today
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
        />
      </div>

      {/* Photo Upload Field */}
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
          Employee Photo
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {form.photoPreviewUrl && (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
            <img src={form.photoPreviewUrl} alt="Employee Preview" className="w-24 h-24 object-cover rounded-full border-2 border-blue-300 shadow-md" />
          </div>
        )}
      </div>

      {/* Add Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 transform hover:scale-105"
      >
        Add Employee
      </button>
    </motion.form>
  );
}