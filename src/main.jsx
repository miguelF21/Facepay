import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-whrxbulkwlxu1gbp.us.auth0.com";
const clientId = "1FdAzLne2nVELULFDsefBTtt8P67nKz1";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={"dev-whrxbulkwlxu1gbp.us.auth0.com"}
    clientId={"1FdAzLne2nVELULFDsefBTtt8P67nKz1"}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);

