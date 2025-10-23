import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zypyviskemdvvqnjnnui.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={domain}
    supabase={supabase}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
