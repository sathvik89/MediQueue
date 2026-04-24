import React, { useState } from 'react';
import { Search, ChevronDown, UserSquare2, Mail, Phone, Calendar } from 'lucide-react';
import type { PatientAdminView } from '../../types';

interface PatientListTableProps {
  patients: PatientAdminView[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const PatientListTable: React.FC<PatientListTableProps> = ({ 
  patients, searchQuery, onSearchChange, sortBy, onSortChange 
}) => {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', overflow: 'hidden' }}>
      
      {/* ─── Controls Header ─── */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search patients by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ 
              width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', borderRadius: '0.5rem', 
              border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text-dark)', 
              fontSize: '0.875rem', outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort By:</span>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)',
              background: 'var(--bg-color)', color: 'var(--text-dark)', fontSize: '0.875rem', outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="appointments">Most Appointments</option>
          </select>
        </div>
      </div>

      {/* ─── Table ─── */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Patient</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Contact Info</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Joined Date</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>Total Appts</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s', ...{ ':hover': { background: 'var(--bg-color)' } } }}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserSquare2 size={20} />
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.875rem' }}>{patient.name}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      <Mail size={14} /> {patient.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      <Phone size={14} /> {patient.phone}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '0.875rem', fontWeight: 500 }}>
                    <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                    {new Date(patient.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={{ 
                    background: 'var(--bg-primary, #f1f5f9)', color: 'var(--text-dark)', padding: '0.25rem 0.75rem', 
                    borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 
                  }}>
                    {patient.totalAppointments}
                  </span>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No patients found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
