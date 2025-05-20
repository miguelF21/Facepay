function Reports() {
    return (
      <>
        <h2>Reports</h2>
        <p>Choose a date range to generate reports (future feature).</p>
        <form>
          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input type="date" className="form-control" />
          </div>
          <button className="btn btn-primary">Generate Report</button>
        </form>
      </>
    );
  }
  
  export default Reports;
  