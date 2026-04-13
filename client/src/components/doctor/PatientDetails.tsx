import React from 'react';
import type { PatientConsultation } from '../../types';
import './PatientDetails.css';

interface PatientDetailsProps {
  patient: PatientConsultation | null;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  if (!patient) {
    return (
      <div className="no-patient">
        <p>No active consultation. Click "Call Next" to see the next patient.</p>
      </div>
    );
  }

  return (
    <div className="patient-details-card">
      <h3>Active Consultation</h3>
      <dl className="details-grid">
        <div className="detail-item">
          <dt>Patient Name</dt>
          <dd>{patient.patientName}</dd>
        </div>
        <div className="detail-item">
          <dt>Time Slot</dt>
          <dd>{patient.timeSlot}</dd>
        </div>
        <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
          <dt>Reported Issues / Reason</dt>
          <dd>{patient.issues || 'None reported'}</dd>
        </div>
      </dl>
    </div>
  );
};
