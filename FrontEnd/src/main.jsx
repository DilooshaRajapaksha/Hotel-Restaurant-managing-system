import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "leaflet/dist/leaflet.css";
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import './admin-responsive.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { AuthProvider } from './Context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="">
      <BrowserRouter>
      <AuthProvider>
          <App />
      </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)