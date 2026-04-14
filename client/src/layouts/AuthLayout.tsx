import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      {/* Background glowing blobs */}
      <div className="auth-bg-blob-1" />
      <div className="auth-bg-blob-2" />
      
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <Activity size={32} />
            MediQueue
          </Link>
          <motion.h1 
            className="auth-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >{title}</motion.h1>
          <motion.p 
            className="auth-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >{subtitle}</motion.p>
        </div>
        <div className="auth-body">
          {children}
        </div>
        <div className="auth-footer">
          {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
        </div>
      </motion.div>
    </div>
  );
};
