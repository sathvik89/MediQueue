import React, { useState } from 'react';
import { X, User, Stethoscope, Zap, Calendar, Clock, FileText, AlertTriangle } from 'lucide-react';
import type { Doctor, AppointmentType, CasePriority } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (payload: {
    doctorId: string;
    date: string;
    time: string;
    type: AppointmentType;
    reasonForVisit: string;
    priority?: CasePriority;
  }) => Promise<void>;
}

const APPOINTMENT_TYPES: { value: AppointmentType; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { value: 'WALK_IN',    label: 'Walk-In',   icon: User,          desc: 'Show up and get a token', color: '#0369a1' },
  { value: 'SCHEDULED',  label: 'Scheduled', icon: Calendar,      desc: 'Book a fixed time slot',  color: '#5b21b6' },
  { value: 'EMERGENCY',  label: 'Emergency', icon: AlertTriangle,  desc: 'Immediate priority entry', color: '#991b1b' },
];

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('SCHEDULED');
  const [selectedTime, setSelectedTime] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedTime || !date || !reason.trim()) return;
    setIsLoading(true);
    try {
      await onConfirm({ doctorId: doctor.id, date, time: selectedTime, type: appointmentType, reasonForVisit: reason });
      onClose();
      setStep(1);
      setSelectedTime('');
      setReason('');
    } finally {
      setIsLoading(false);
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: '1rem', backdropFilter: 'blur(4px)',
  };

  const modalStyle: React.CSSProperties = {
    background: 'var(--surface)', borderRadius: '1rem', width: '100%', maxWidth: 520,
    maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  };

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 0.25rem' }}>Book Appointment</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Stethoscope size={14} /> {doctor.name} · {doctor.specialty}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Step 1: Appointment Type (Factory Pattern!) */}
          {step === 1 && (
            <>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={14} color="var(--primary)" /> Select Appointment Type
                  <span style={{ fontSize: '0.7rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.125rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>Factory Pattern</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {APPOINTMENT_TYPES.map(type => {
                    const Icon = type.icon;
                    const isSelected = appointmentType === type.value;
                    return (
                      <button key={type.value} onClick={() => setAppointmentType(type.value)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem',
                          border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                          borderRadius: '0.625rem', background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                        }}>
                        <div style={{ width: 36, height: 36, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--primary)' : 'var(--bg-color)', color: isSelected ? 'white' : type.color, flexShrink: 0 }}>
                          <Icon size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem' }}>{type.label}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{type.desc}</div>
                        </div>
                        {isSelected && <StatusBadge variant={type.value} size="sm" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button onClick={() => setStep(2)}
                style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem' }}>
                Continue →
              </button>
            </>
          )}

          {/* Step 2: Date, Slot & Reason */}
          {step === 2 && (
            <>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                ← Back
              </button>

              <div style={{ background: 'var(--bg-color)', borderRadius: '0.625rem', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge variant={appointmentType} size="sm" />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>appointment with {doctor.name}</span>
              </div>

              {/* Date */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  <Calendar size={13} /> Select Date
                </label>
                <input type="date" className="input-field" value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Time slots */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  <Clock size={13} /> Select Time Slot
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {doctor.availability.map(slot => (
                    <button key={slot} type="button"
                      onClick={() => setSelectedTime(slot)}
                      style={{
                        padding: '0.5rem', border: `2px solid ${selectedTime === slot ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: '0.5rem', background: selectedTime === slot ? 'var(--primary-light)' : 'var(--surface)',
                        color: selectedTime === slot ? 'var(--primary)' : 'var(--text-dark)', fontWeight: 600,
                        fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.15s',
                      }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                  <FileText size={13} /> Reason for Visit
                </label>
                <textarea value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Briefly describe your symptoms or reason..."
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontFamily: 'inherit', fontSize: '0.875rem', resize: 'vertical', minHeight: 80, color: 'var(--text-primary)', background: 'var(--surface)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={onClose}
                  style={{ flex: 1, padding: '0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-dark)' }}>
                  Cancel
                </button>
                <button onClick={handleConfirm}
                  disabled={!selectedTime || !date || !reason.trim() || isLoading}
                  style={{ flex: 2, padding: '0.75rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: !selectedTime || !date || !reason.trim() ? 'not-allowed' : 'pointer', opacity: !selectedTime || !date || !reason.trim() ? 0.6 : 1, fontSize: '0.9375rem' }}>
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
