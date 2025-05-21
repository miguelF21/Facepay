import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AuthPage({ onLogin }) {
  const { mode } = useParams();
  const navigate = useNavigate();

  const handleAuth0 = () => {
    // simulate auth0 login
    const fakeUser = { sub: 'auth0|demo', name: 'Auth0 User' };
    onLogin(fakeUser);
    navigate('/');
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h3 className="card-title text-center">{mode === 'login' ? 'Sign In' : 'Sign Up'}</h3>
            <p className="text-center text-muted">(Placeholder login with Auth0)</p>
            <button className={`btn btn-${mode === 'login' ? 'primary' : 'success'} w-100`} onClick={handleAuth0}>
              Continue with Auth0
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
