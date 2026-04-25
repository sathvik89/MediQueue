import React from 'react';
import { Power, Stethoscope, Clock } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../Button';
import type { Doctor } from '../../types';

interface DoctorShowcaseProps {
  doctors: Doctor[];
  onToggleStatus: (id: string) => void;
  onRemove: (id: string) => void;
}

export const DoctorShowcase: React.FC<DoctorShowcaseProps> = ({ doctors, onToggleStatus, onRemove }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {doctors.map(doc => (
        <div key={doc.id} style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}>
          <div style={{
            height: '140px',
            background: doc.imageUrl ? `url(${doc.imageUrl}) center/cover` : 'var(--border)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <StatusBadge variant={doc.availabilityStatus} />
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Stethoscope size={18} style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-dark)' }}>{doc.name}</h3>
            </div>
            <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{doc.specialty}</p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                <Clock size={14} />
                {doc.availability.length} slots today
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <Button 
                variant={doc.availabilityStatus === 'OFF_DUTY' ? 'primary' : 'outline'} 
                onClick={() => onToggleStatus(doc.id)}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', opacity: doc.availabilityStatus === 'BUSY' ? 0.5 : 1 }}
                disabled={doc.availabilityStatus === 'BUSY'}
              >
                <Power size={16} />
                {doc.availabilityStatus === 'OFF_DUTY' ? 'Set Active' : 'Set Off-Duty'}
              </Button>
              <Button variant="danger" onClick={() => onRemove(doc.id)} style={{ padding: '0.5rem 1rem' }}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
      {doctors.length === 0 && (
        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No doctors found.
        </div>
      )}
    </div>
  );
};
