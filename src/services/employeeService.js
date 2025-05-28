// src/services/employeeService.js

const STORAGE_KEY = "employees";

export function getEmployees() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveEmployee(employee) {
  const employees = getEmployees();
  employees.push(employee);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function updateEmployee(id, updatedData) {
  const employees = getEmployees();
  const updated = employees.map(emp =>
    emp.id === id ? { ...emp, ...updatedData } : emp
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteEmployee(id) {
  const filtered = getEmployees().filter(emp => emp.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
