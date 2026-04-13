import React from 'react';
import type { Doctor } from '../../types';
import { Button } from '../Button';
import './DoctorCard.css';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const getInitials = (name: string) => {
    return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="doctor-card">
      <div className="doctor-info">
        <div className="doctor-avatar">
          {getInitials(doctor.name)}
        </div>
        <div className="doctor-details">
          <h3>{doctor.name}</h3>
          <p className="doctor-specialty">{doctor.specialty}</p>
        </div>
      </div>
      
      <div className="doctor-availability">
        <span className="availability-label">Available Today</span>
        <div className="time-slots">
          {doctor.availability.map((time) => (
            <span key={time} className="time-slot">{time}</span>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto' }}>
        <Button fullWidth onClick={() => onBook(doctor)}>
          Book Appointment
        </Button>
      </div>
    </div>
  );
};
