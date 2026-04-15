import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '3.5rem 2rem', textAlign: 'center', gap: '1rem',
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: '1rem', background: 'var(--primary-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
    }}>
      <Icon size={28} />
    </div>
    <div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 0.375rem' }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 320 }}>{description}</p>
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface SpinnerProps { size?: number; }
export const Spinner: React.FC<SpinnerProps> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    style={{ animation: 'spin 0.8s linear infinite' }}>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
    <div>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0' }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ElementType;
  color?: string;
}
export const StatCard: React.FC<StatCardProps> = ({ label, value, sublabel, icon: Icon, color = 'var(--primary)' }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem',
    padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: '0.75rem', display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
      background: color === 'var(--primary)' ? 'var(--primary-light)' : `${color}15`,
      color,
    }}>
      <Icon size={22} />
    </div>
    <div>
      <div style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{label}</div>
      {sublabel && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{sublabel}</div>}
    </div>
  </div>
);