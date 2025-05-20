function Employees() {
    const employees = [
      { name: 'Miguel Fuentes', role: 'Developer', email: 'miguelfuentes2101@gmail.com' },
      { name: 'Juan Pérez', role: 'HR Manager', email: 'juan@example.com' },
    ];
  
    return (
      <>
        <h2>Employees</h2>
        <table className="table table-bordered">
          <thead><tr><th>Name</th><th>Role</th><th>Email</th></tr></thead>
          <tbody>
            {employees.map((e, i) => (
              <tr key={i}><td>{e.name}</td><td>{e.role}</td><td>{e.email}</td></tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  
  export default Employees;
  