import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkTo
}) => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Activity size={32} />
            MediQueue
          </Link>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>
        <div className="auth-body">
          {children}
        </div>
        <div className="auth-footer">
          {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
        </div>
      </div>
    </div>
  );
};
