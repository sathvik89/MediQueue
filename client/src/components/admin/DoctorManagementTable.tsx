import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Doctor } from '../../types';
import './DoctorManagementTable.css';

interface DoctorManagementTableProps {
  doctors: Doctor[];
  onRemove: (id: string) => Promise<void>;
}

export const DoctorManagementTable: React.FC<DoctorManagementTableProps> = ({ doctors, onRemove }) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleRemove = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this doctor from the roster?")) {
      setRemovingId(id);
      try {
        await onRemove(id);
      } finally {
        setRemovingId(null);
      }
    }
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
      <table className="doctor-mgmt-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Specialty</th>
            <th>Availability Slots</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc.id}>
              <td>
                <div className="doctor-intro">
                  <div className="doctor-avatar-sm">{getInitials(doc.name)}</div>
                  <span className="doctor-name-col">{doc.name}</span>
                </div>
              </td>
              <td>
                <span className="doctor-specialty-col">{doc.specialty}</span>
              </td>
              <td>
                <span className="doctor-specialty-col">{doc.availability.length} active slots</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button 
                  className="remove-btn" 
                  onClick={() => handleRemove(doc.id)}
                  disabled={removingId === doc.id}
                  title="Remove Doctor"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {doctors.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No doctors found in the system.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
