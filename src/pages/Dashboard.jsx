function Dashboard() {
    return (
      <>
        <h2>Admin Dashboard</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card bg-primary text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Employees</h5>
                <p className="card-text">2</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Recent Payments</h5>
                <p className="card-text">April 20, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default Dashboard;
  