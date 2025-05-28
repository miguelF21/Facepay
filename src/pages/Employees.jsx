// Employees.jsx
import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  // Load employees from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) setEmployees(JSON.parse(stored));
  }, []);

  // Save employees to localStorage whenever the employees state changes
  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  // Add a new employee
  const handleAdd = (newEmployee) => {
    setEmployees([...employees, newEmployee]);
  };

  // Delete an employee
  const handleDelete = (id) => {
    // Confirmation before deleting
    if (window.confirm("Are you sure you want to delete this employee permanently?")) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  // Set departure reason and mark as departed
  const handleSetReason = (id, reason, departureDate) => {
    setEmployees(
      employees.map(e =>
        e.id === id ? { ...e, reason: reason, isDeparted: true, departureDate: departureDate } : e
      )
    );
  };

  // Reinstate an employee and calculate time outside
  const handleReinstate = (id) => {
    const today = new Date();
    setEmployees(
      employees.map(e => {
        if (e.id === id) {
          const departureDate = new Date(e.departureDate);
          const timeDiff = Math.abs(today.getTime() - departureDate.getTime()); // Difference in milliseconds

          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const months = Math.floor(days / 30.44); // Average days in a month
          const years = Math.floor(months / 12);

          let timeOutsideString = '';
          if (years > 0) timeOutsideString += `${years} year(s) `;
          if (months % 12 > 0) timeOutsideString += `${months % 12} month(s) `;
          if (days % 30.44 > 0 && months === 0) timeOutsideString += `${Math.floor(days % 30.44)} day(s)`; // Only show days if less than a month

          return {
            ...e,
            isDeparted: false, // Mark as not departed
            reinstatementDate: today.toISOString().split('T')[0], // Set reinstatement date
            timeOutside: timeOutsideString.trim() || 'Less than a day', // Store calculated time
            reason: '', // Clear departure reason
            departureDate: null, // Clear departure date
          };
        }
        return e;
      })
    );
  };

  return (
    <div className="flex-1 p-8 lg:ml-64 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto grid gap-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight drop-shadow-sm"
        >
          Employee Management
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-md rounded-2xl p-6 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                Add New Employee
              </h2>
              <CardContent className="p-0">
                <EmployeeForm onAdd={handleAdd} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="shadow-md rounded-2xl p-6 h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                Employee List
              </h2>
              <CardContent className="p-0">
                <EmployeeList
                  employees={employees}
                  onDelete={handleDelete}
                  onSetReason={handleSetReason}
                  onReinstate={handleReinstate} // Pass the new onReinstate function
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}