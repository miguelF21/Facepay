import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'react-bootstrap';

export default function LandingPage() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="text-center mt-5">
      <h1 className="display-4">Welcome to Facepay</h1>
      <p className="lead">Facial Recognition Based Attendance Control System</p>
      {!isAuthenticated ? (
        <>
          <Button variant="primary" size="lg" className="me-2" onClick={() => loginWithRedirect()}>Sign In</Button>
          <Button variant="success" size="lg" onClick={() => loginWithRedirect({ screen_hint: 'signup' })}>Sign Up</Button>
        </>
      ) : (
        <div className="alert alert-info mt-4">Welcome back!</div>
      )}
    </div>
  );
}
