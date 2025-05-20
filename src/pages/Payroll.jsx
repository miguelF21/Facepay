function Payroll() {
    const payroll = [
      { name: 'Miguel Fuentes', hours: 76, payment: '$1,520' },
      { name: 'Juan Pérez', hours: 80, payment: '$2,000' },
    ];
  
    return (
      <>
        <h2>Payroll Overview</h2>
        <table className="table table-hover">
          <thead><tr><th>Employee</th><th>Hours Worked</th><th>Payment</th></tr></thead>
          <tbody>
            {payroll.map((p, i) => (
              <tr key={i}><td>{p.name}</td><td>{p.hours}</td><td>{p.payment}</td></tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  
  export default Payroll;
  