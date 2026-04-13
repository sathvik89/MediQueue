import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Doctor } from '../../types';
import { Button } from '../Button';
import './BookingModal.css';

interface BookingModalProps {
  doctor: Doctor;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (doctorId: string, date: string, time: string) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, isOpen, onClose, onConfirm }) => {
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedTime || !date) return;
    setIsLoading(true);
    try {
      await onConfirm(doctor.id, date, selectedTime);
      onClose(); // Parent handles closing and showing success
    } catch (e) {
      console.error('Failed to book', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Book Consultation</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{doctor.name}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{doctor.specialty}</p>
          </div>

          <div className="input-wrapper" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Select Date</label>
            <input 
              type="date" 
              className="input-field" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // prevent past dates
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="input-label">Select Time Slot</label>
            <div className="time-grid">
              {doctor.availability.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`time-select-btn ${selectedTime === time ? 'selected' : ''}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTime || !date || isLoading} isLoading={isLoading}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
};
