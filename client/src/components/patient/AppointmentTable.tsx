import React, { useState } from 'react';
import type { Appointment } from '../../types';
import './AppointmentTable.css';

interface AppointmentTableProps {
  appointments: Appointment[];
  onCancel: (id: string) => Promise<void>;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, onCancel }) => {
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setCancelingId(id);
      try {
        await onCancel(id);
      } finally {
        setCancelingId(null);
      }
    }
  };

  if (appointments.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>You don't have any appointments yet.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>
                <div className="doctor-cell">
                  <span className="doctor-name">{appt.doctorName}</span>
                  <span className="doctor-spec">{appt.specialty}</span>
                </div>
              </td>
              <td>
                <div className="date-time-cell">
                  <span className="appt-date">{new Date(appt.date).toLocaleDateString()}</span>
                  <span className="appt-time">{appt.time}</span>
                </div>
              </td>
              <td>
                <span className={`status-badge status-${appt.status}`}>
                  {appt.status}
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                {appt.status === 'scheduled' && (
                  <button 
                    className="action-btn"
                    onClick={() => handleCancel(appt.id)}
                    disabled={cancelingId === appt.id}
                  >
                    {cancelingId === appt.id ? 'Canceling...' : 'Cancel'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
