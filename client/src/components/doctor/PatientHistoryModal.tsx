import React from 'react';
import { X, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface PatientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  history: any[];
  isLoading: boolean;
}

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  isOpen, onClose, patientName, history, isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: 'var(--surface)', borderRadius: '1rem', width: '100%', maxWidth: 700, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Medical History</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.125rem 0 0' }}>Patient: {patientName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-color)', border: 'none', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>Loading records...</p>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-color)', borderRadius: '0.75rem' }}>
              <FileText size={48} color="var(--border)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--text-dark)', margin: '0 0 0.5rem' }}>No Records Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>This patient doesn't have any previous consultation records in our system.</p>
            </div>
          ) : (
            history.map((record) => (
              <div key={record.id} style={{ border: '1px solid var(--border)', borderRadius: '0.875rem', overflow: 'hidden' }}>
                <div style={{ background: 'var(--bg-color)', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-dark)' }}>
                    <Calendar size={14} color="var(--primary)" />
                    {new Date(record.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Dr. {record.doctorName}
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Diagnosis</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.4 }}>{record.diagnosis}</div>
                  </div>
                  
                  {record.prescription && record.prescription.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Prescribed Medicines</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {record.prescription.map((m: string) => (
                          <span key={m} style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Doctor's Notes</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{record.notes}</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border)', background: 'var(--bg-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.625rem 1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', color: 'var(--text-dark)' }}>
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
