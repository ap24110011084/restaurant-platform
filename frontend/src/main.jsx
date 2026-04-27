import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: {
            background: '#334155',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
            fontSize: '14px',
          },
        }} />
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)