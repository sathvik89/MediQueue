import React, { ReactNode } from 'react';
import { Activity, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const { user } = authState;

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <a href="/" className="dashboard-logo">
          <Activity size={24} />
          MediQueue
        </a>
        
        <div className="dashboard-nav">
          <div className="user-profile">
            <div className="avatar">
              {getInitials(user?.name)}
            </div>
            <span className="user-name" style={{textTransform: 'capitalize'}}>
              {user?.name} ({user?.role})
            </span>
          </div>
          <Button variant="outline" onClick={handleLogout} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', gap: '0.5rem' }}>
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
};
