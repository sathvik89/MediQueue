import React from 'react';
import type { AppointmentStatus, QueueEntryStatus, AvailabilityStatus, AppointmentType, CasePriority } from '../../types';

type BadgeVariant = AppointmentStatus | QueueEntryStatus | AvailabilityStatus | AppointmentType | 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';

const variantMap: Record<string, { label: string; style: React.CSSProperties }> = {
  // Appointment Status
  PENDING:          { label: 'Pending',          style: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } },
  CONFIRMED:        { label: 'Confirmed',         style: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' } },
  IN_QUEUE:         { label: 'In Queue',          style: { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' } },
  IN_CONSULTATION:  { label: 'In Consultation',   style: { background: '#ede9fe', color: '#5b21b6', border: '1px solid #c4b5fd' } },
  COMPLETED:        { label: 'Completed',         style: { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' } },
  CANCELLED:        { label: 'Cancelled',         style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
  RESCHEDULED:      { label: 'Rescheduled',       style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74' } },
  // Queue Entry Status
  WAITING:          { label: 'Waiting',           style: { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' } },
  CALLED:           { label: 'Called',            style: { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' } },
  IN_PROGRESS:      { label: 'In Progress',       style: { background: '#ede9fe', color: '#5b21b6', border: '1px solid #c4b5fd' } },
  DONE:             { label: 'Done',              style: { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' } },
  MISSED:           { label: 'Missed',            style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
  // Availability
  AVAILABLE:        { label: 'Available',         style: { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' } },
  BUSY:             { label: 'Busy',              style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
  ON_BREAK:         { label: 'On Break',          style: { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } },
  OFF_DUTY:         { label: 'Off Duty',          style: { background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' } },
  // Appointment Type
  WALK_IN:          { label: 'Walk-In',           style: { background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc' } },
  SCHEDULED:        { label: 'Scheduled',         style: { background: '#ede9fe', color: '#5b21b6', border: '1px solid #c4b5fd' } },
  EMERGENCY:        { label: 'Emergency',         style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
  // Priority
  CRITICAL:         { label: 'Critical',          style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } },
  HIGH:             { label: 'High',              style: { background: '#fff7ed', color: '#9a3412', border: '1px solid #fdba74' } },
  NORMAL:           { label: 'Normal',            style: { background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' } },
  LOW:              { label: 'Low',               style: { background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db' } },
};

const priorityMap: Record<number, string> = { 1: 'LOW', 2: 'NORMAL', 3: 'HIGH', 4: 'CRITICAL' };

interface StatusBadgeProps {
  variant: BadgeVariant;
  priority?: CasePriority;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, priority, size = 'md' }) => {
  const key = priority ? priorityMap[priority] : variant;
  const cfg = variantMap[key] ?? { label: key, style: {} };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: size === 'sm' ? '0.15rem 0.5rem' : '0.25rem 0.625rem',
      borderRadius: '999px', fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
      fontWeight: 600, whiteSpace: 'nowrap', lineHeight: 1.5,
      ...cfg.style,
    }}>
      {cfg.label}
    </span>
  );
};