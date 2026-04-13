import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientDashboard } from './pages/PatientDashboard';

import { DoctorDashboard } from './pages/DoctorDashboard';

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

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole?: string }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && authState.user.role !== allowedRole) {
    // If they go to wrong dashboard, send them to login or their actual dashboard
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="patient">
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardPlaceholder role="Admin" />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
