import { useState, useEffect } from "react";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("employees");
    if (stored) setEmployees(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleAdd = (emp) => {
    setEmployees([...employees, emp]);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const handleSetReason = (id, reason) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, reason } : e));
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Employee management</h1>
      <EmployeeForm onAdd={handleAdd} />
      <EmployeeList employees={employees} onDelete={handleDelete} onSetReason={handleSetReason} />
    </div>
  );
}
