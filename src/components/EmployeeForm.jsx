import { useState } from "react";

export default function EmployeeForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", position: "", date: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.position || !form.date) return;
    onAdd({ ...form, id: Date.now(), reason: "" });
    setForm({ name: "", position: "", date: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Add New Employee</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full name"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="position"
        value={form.position}
        onChange={handleChange}
        placeholder="Position"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add
      </button>
    </form>
  );
}
