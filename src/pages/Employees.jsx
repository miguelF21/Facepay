import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { 
  getEmployees, 
  deleteEmployee, 
  searchEmployees,
  getEmployeesByDepartment 
} from "../services/employeeService";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadEmployees();
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchEmployees(searchTerm);
      setEmployees(results);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDepartment = async (department) => {
    setSelectedDepartment(department);
    if (!department) {
      loadEmployees();
      return;
    }

    try {
      setLoading(true);
      const results = await getEmployeesByDepartment(department);
      setEmployees(results);
    } catch (err) {
      setError("Filter failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await deleteEmployee(id);
      setSuccess("Employee deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      await loadEmployees();
    } catch (err) {
      setError("Failed to delete employee. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEmployeeAdded = () => {
    setSuccess("Employee added successfully!");
    setTimeout(() => setSuccess(null), 3000);
    setShowForm(false);
    loadEmployees();
  };

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Employee Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage your workforce efficiently
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add Employee"}
            </button>
          </div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200 font-medium">{success}</p>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or employee code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={selectedDepartment}
                onChange={(e) => handleFilterByDepartment(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Add Employee Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                    Add New Employee
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <EmployeeForm onSuccess={handleEmployeeAdded} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Employee List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                  Employee List
                </span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                  {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading employees...</p>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">
                    No employees found
                  </p>
                  <p className="text-slate-500 dark:text-slate-500">
                    {searchTerm || selectedDepartment
                      ? "Try adjusting your search or filter"
                      : "Add your first employee to get started"}
                  </p>
                </div>
              ) : (
                <EmployeeList
                  employees={employees}
                  onDelete={handleDelete}
                  onRefresh={loadEmployees}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
