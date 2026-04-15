import React from 'react';
import type { ReactNode } from 'react';
import { Activity, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: { id: string; label: string; icon: React.ElementType; badge?: number }[];
  activeNav: string;
  onNavChange: (id: string) => void;
  pageTitle: string;
  unreadNotifications?: number;
  onNotifClick?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navItems,
  activeNav,
  onNavChange,
  pageTitle,
  unreadNotifications = 0,
  onNotifClick,
}) => {
  const { authState, logout } = useAuth();
  const { user } = authState;

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-wrapper">
      {/* ─── Sidebar ──────────────────────────────────────────────── */}
      <aside className="dashboard-sidebar">
        <a href="/" className="sidebar-logo">
          <Activity size={22} />
          MediQueue
        </a>

        <span className="sidebar-section-label">Navigation</span>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => onNavChange(item.id)}
              >
                <Icon size={18} />
                {item.label}
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user?.name)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={logout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <h1 className="topbar-title">{pageTitle}</h1>
          <div className="topbar-actions">
            <button className="notif-btn" onClick={onNotifClick} title="Notifications">
              <Bell size={18} />
              {unreadNotifications > 0 && <span className="notif-dot" />}
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
};
