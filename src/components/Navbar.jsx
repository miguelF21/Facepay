import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">Facepay</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoading ? null : (
              !isAuthenticated ? (
                <>
                  <Button variant="outline-light" className="me-2" onClick={() => loginWithRedirect()}>Sign In</Button>
                  <Button variant="light" onClick={() => loginWithRedirect({ screen_hint: 'signup' })}>Sign Up</Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/employees">Employees</Nav.Link>
                  <Nav.Link as={Link} to="/attendance">Attendance</Nav.Link>
                  <Nav.Link as={Link} to="/payroll">Payroll</Nav.Link>
                  <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                  <span className="navbar-text text-light mx-3">{user.name}</span>
                  <Button variant="outline-light" onClick={() => logout({ returnTo: window.location.origin })}>Logout</Button>
                </>
              )
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
