import React from 'react';
import type { AvailabilityStatus } from '../../types';

const STATUSES: { value: AvailabilityStatus; label: string; desc: string; icon: string; bg: string; border: string; color: string }[] = [
  { value: 'AVAILABLE', label: 'Available',  desc: 'Ready to see patients',      icon: '🟢', bg: '#ecfdf5', border: '#6ee7b7', color: '#047857' },
  { value: 'BUSY',      label: 'Busy',       desc: 'In consultation',            icon: '🔴', bg: '#fee2e2', border: '#fca5a5', color: '#991b1b' },
  { value: 'ON_BREAK',  label: 'On Break',   desc: 'Temporarily unavailable',    icon: '🟡', bg: '#fef3c7', border: '#fde68a', color: '#92400e' },
  { value: 'OFF_DUTY',  label: 'Off Duty',   desc: 'Not available today',        icon: '⚫', bg: '#f3f4f6', border: '#d1d5db', color: '#4b5563' },
];

interface AvailabilityControlProps {
  status: AvailabilityStatus;
  onChange: (status: AvailabilityStatus) => void;
  isLoading: boolean;
}

export const AvailabilityControl: React.FC<AvailabilityControlProps> = ({ status, onChange, isLoading }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>
        Set your current availability status
      </div>
      {STATUSES.map(s => {
        const isActive = status === s.value;
        return (
          <button key={s.value} onClick={() => onChange(s.value)} disabled={isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1rem',
              border: `2px solid ${isActive ? s.border : 'var(--border)'}`,
              borderRadius: '0.75rem', background: isActive ? s.bg : 'var(--surface)',
              cursor: isLoading ? 'not-allowed' : 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}>
            <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: isActive ? s.color : 'var(--text-dark)', fontSize: '0.9rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
            </div>
            {isActive && (
              <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>Active</span>
            )}
          </button>
        );
      })}
    </div>
  );
};