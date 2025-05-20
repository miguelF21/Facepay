function Attendance() {
    const records = [
      { name: 'Miguel Fuentes', type: 'Entry', time: '08:05 AM', date: '2025-04-12' },
      { name: 'Miguel Fuentes', type: 'Exit', time: '05:01 PM', date: '2025-04-12' },
      { name: 'Juan Pérez', type: 'Entry', time: '08:03 AM', date: '2025-04-12' },
      { name: 'Juan Pérez', type: 'Exit', time: '05:00 PM', date: '2025-04-12' },
    ];
  
    return (
      <>
        <h2>Attendance Records</h2>
        <table className="table table-striped">
          <thead><tr><th>Employee</th><th>Type</th><th>Time</th><th>Date</th></tr></thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}><td>{r.name}</td><td>{r.type}</td><td>{r.time}</td><td>{r.date}</td></tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  
  export default Attendance;
  