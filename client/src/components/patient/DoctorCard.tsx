import React from 'react';
import { Stethoscope, Clock, Calendar } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import type { Doctor } from '../../types';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const initials = doctor.name.split(' ').filter(w => w.startsWith('Dr.') ? false : true).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem',
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
      transition: 'box-shadow 0.2s, border-color 0.2s', cursor: 'default',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,86,179,0.2)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = ''; (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '0.75rem', background: 'var(--primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9375rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {doctor.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <Stethoscope size={13} />
            {doctor.specialty}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <StatusBadge variant={doctor.availabilityStatus} size="sm" />
        </div>
      </div>

      {/* Available Slots */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          <Clock size={12} /> Available Slots
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {doctor.availability.slice(0, 5).map(slot => (
            <span key={slot} style={{
              padding: '0.2rem 0.5rem', background: 'var(--bg-color)', border: '1px solid var(--border)',
              borderRadius: '0.375rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dark)',
            }}>
              {slot}
            </span>
          ))}
          {doctor.availability.length > 5 && (
            <span style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              +{doctor.availability.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Book button */}
      <button
        onClick={() => onBook(doctor)}
        disabled={doctor.availabilityStatus === 'OFF_DUTY'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.625rem', borderRadius: '0.5rem', border: 'none',
          background: doctor.availabilityStatus === 'OFF_DUTY' ? 'var(--secondary)' : 'var(--primary)',
          color: doctor.availabilityStatus === 'OFF_DUTY' ? 'var(--text-secondary)' : 'white',
          fontWeight: 600, fontSize: '0.875rem', cursor: doctor.availabilityStatus === 'OFF_DUTY' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { if (doctor.availabilityStatus !== 'OFF_DUTY') (e.currentTarget as HTMLButtonElement).style.background = 'var(--primary-hover)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = doctor.availabilityStatus === 'OFF_DUTY' ? 'var(--secondary)' : 'var(--primary)'; }}
      >
        <Calendar size={15} />
        {doctor.availabilityStatus === 'OFF_DUTY' ? 'Unavailable' : 'Book Appointment'}
      </button>
    </div>
  );
};
