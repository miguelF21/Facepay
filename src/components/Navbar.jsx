import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Smart Payroll</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/employees">Employees</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/attendance">Attendance</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/payroll">Payroll</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
