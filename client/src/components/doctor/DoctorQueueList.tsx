import React from 'react';
import type { PatientConsultation } from '../../types';
import { Button } from '../Button';
import './DoctorQueueList.css';

interface DoctorQueueListProps {
  queue: PatientConsultation[];
  onCallNext: () => void;
  isLoading: boolean;
}

export const DoctorQueueList: React.FC<DoctorQueueListProps> = ({ queue, onCallNext, isLoading }) => {
  const waitingCount = queue.filter(q => q.status === 'waiting').length;

  return (
    <div className="queue-list-container">
      <div className="queue-list-header">
        <div>
          <h3>Today's Queue</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {waitingCount} waiting
          </p>
        </div>
        <Button onClick={onCallNext} disabled={waitingCount === 0 || isLoading} isLoading={isLoading}>
          Call Next
        </Button>
      </div>
      
      <ul className="queue-items">
        {queue.length === 0 ? (
          <li className="queue-item" style={{ justifyContent: 'center', color: 'var(--text-secondary)' }}>
            No patients in queue
          </li>
        ) : (
          queue.map((patient) => (
            <li key={patient.id} className={`queue-item ${patient.status === 'in-progress' ? 'active' : ''}`}>
              <div className="patient-info">
                <span className="patient-info-name">{patient.patientName}</span>
                <span className="patient-info-time">{patient.timeSlot}</span>
              </div>
              <span className={`status-indicator status-${patient.status}`}>
                {patient.status.replace('-', ' ')}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
