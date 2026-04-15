import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, AlertTriangle, Pill, Calendar } from 'lucide-react';
import { EmptyState } from '../ui/index';
import type { MedicalRecord } from '../../types';

interface HistoryTableProps {
  records: MedicalRecord[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (records.length === 0) {
    return <EmptyState icon={FileText} title="No medical history" description="Your past consultation records will appear here." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {records.map(record => {
        const isOpen = expanded === record.id;
        return (
          <div key={record.id} style={{ background: 'var(--surface)', border: `1px solid ${record.isCritical ? '#fca5a5' : 'var(--border)'}`, borderRadius: '0.875rem', overflow: 'hidden' }}>
            {/* Header Row */}
            <button
              onClick={() => setExpanded(isOpen ? null : record.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: record.isCritical ? '#fee2e2' : 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: record.isCritical ? '#dc2626' : 'var(--primary)', flexShrink: 0 }}>
                {record.isCritical ? <AlertTriangle size={18} /> : <FileText size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9375rem', marginBottom: '0.2rem' }}>{record.diagnosis}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{record.doctorName} · {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              {record.isCritical && (
                <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid #fca5a5' }}>CRITICAL</span>
              )}
              {isOpen ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
            </button>

            {/* Expanded Details */}
            {isOpen && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-color)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Doctor's Notes</div>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>{record.notes}</p>
                </div>

                {record.prescription && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.625rem', padding: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.625rem' }}>
                      <Pill size={14} color="var(--primary)" />
                      <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-dark)' }}>Prescription</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.625rem' }}>
                      {record.prescription.medicines.map(med => (
                        <span key={med} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                          {med}
                        </span>
                      ))}
                    </div>
                    {record.prescription.notes && (
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{record.prescription.notes}</p>
                    )}
                  </div>
                )}

                {record.followUpDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: '#d1fae5', borderRadius: '0.5rem', border: '1px solid #6ee7b7' }}>
                    <Calendar size={14} color="#047857" />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#047857' }}>
                      Follow-up: {new Date(record.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};