import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
<React.StrictMode>
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    >
    <React.Suspense fallback={<div>Cargando...</div>}>
      <App />
    </React.Suspense>
  </Auth0Provider>
</React.StrictMode>,
)
