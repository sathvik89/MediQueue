import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Temporary placeholder for protected routes
const DashboardPlaceholder = ({ role }: { role: string }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{role} Dashboard</h1>
    <p>This module is not implemented yet.</p>
    <button 
      onClick={() => {
        localStorage.removeItem('mediQueue_user');
        window.location.href = '/login';
      }}
      className="btn btn-outline"
      style={{ marginTop: '1rem' }}
    >
      Sign Out
    </button>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Placeholders for future modules */}
          <Route path="/dashboard" element={<DashboardPlaceholder role="Patient" />} />
          <Route path="/doctor" element={<DashboardPlaceholder role="Doctor" />} />
          <Route path="/admin" element={<DashboardPlaceholder role="Admin" />} />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
