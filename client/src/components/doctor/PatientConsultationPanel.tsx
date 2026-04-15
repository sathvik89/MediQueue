import React, { useState } from 'react';
import { User, Clock, FileText, AlertTriangle, Pill, X, Plus, Calendar } from 'lucide-react';
import type { PatientConsultation } from '../../types';

interface PatientConsultationPanelProps {
  patient: PatientConsultation | null;
  onComplete: (data: { medicines: string[]; diagnosis: string; notes: string; followUpDate?: string; isCritical: boolean }) => Promise<void>;
}

export const PatientConsultationPanel: React.FC<PatientConsultationPanelProps> = ({ patient, onComplete }) => {
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medInput, setMedInput] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [flagCritical, setFlagCritical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addMedicine = () => {
    if (medInput.trim() && !medicines.includes(medInput.trim())) {
      setMedicines(prev => [...prev, medInput.trim()]);
      setMedInput('');
    }
  };

  const removeMedicine = (med: string) => setMedicines(prev => prev.filter(m => m !== med));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) return;
    setIsLoading(true);
    try {
      await onComplete({ medicines, diagnosis, notes, followUpDate: followUpDate || undefined, isCritical: flagCritical });
      setMedicines([]); setDiagnosis(''); setNotes(''); setFollowUpDate(''); setFlagCritical(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!patient) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={28} color="var(--text-secondary)" />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.375rem' }}>No Active Consultation</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click "Call Next" to bring in the next patient</div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Patient Info */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #2563eb 100%)', borderRadius: '0.875rem', padding: '1.25rem', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
            {patient.patientName.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.0625rem' }}>{patient.patientName}</span>
              {patient.isCritical && <span style={{ background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '999px' }}>CRITICAL</span>}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8125rem', opacity: 0.85 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {patient.timeSlot}</span>
              <span>Token #{patient.tokenNumber}</span>
            </div>
          </div>
        </div>
        {patient.issues && (
          <div style={{ marginTop: '0.875rem', padding: '0.625rem', background: 'rgba(255,255,255,0.12)', borderRadius: '0.5rem', fontSize: '0.875rem', lineHeight: 1.5 }}>
            <strong>Chief Complaint:</strong> {patient.issues}
          </div>
        )}
      </div>

      {/* Diagnosis */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.875rem', marginBottom: '0.625rem' }}>
          <FileText size={14} color="var(--primary)" /> Diagnosis *
        </label>
        <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Enter diagnosis..." required
          style={{ width: '100%', boxSizing: 'border-box', padding: '0.625rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.9rem', fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg-color)' }}
        />
      </div>

      {/* Prescription — Medicines (chip input) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.875rem', marginBottom: '0.625rem' }}>
          <Pill size={14} color="var(--primary)" /> Prescription — Medicines
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <input value={medInput} onChange={e => setMedInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMedicine(); } }}
            placeholder="Type medicine name & press Enter..."
            style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg-color)' }}
          />
          <button type="button" onClick={addMedicine}
            style={{ padding: '0.5rem 0.875rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={16} />
          </button>
        </div>
        {medicines.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {medicines.map(med => (
              <span key={med} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 600 }}>
                {med}
                <button type="button" onClick={() => removeMedicine(med)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Dosage instructions, special advice..."
          style={{ width: '100%', boxSizing: 'border-box', marginTop: '0.75rem', padding: '0.625rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontFamily: 'inherit', minHeight: 72, resize: 'vertical', color: 'var(--text-primary)', background: 'var(--bg-color)' }}
        />
      </div>

      {/* Follow-up & Critical flag */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.875rem', marginBottom: '0.625rem' }}>
            <Calendar size={14} color="var(--primary)" /> Recommend Follow-up
          </label>
          <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.875rem', fontFamily: 'inherit', color: 'var(--text-primary)', background: 'var(--bg-color)' }}
          />
        </div>
        <div style={{ background: flagCritical ? '#fff0f0' : 'var(--surface)', border: `1px solid ${flagCritical ? '#fca5a5' : 'var(--border)'}`, borderRadius: '0.875rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700, color: flagCritical ? '#dc2626' : 'var(--text-dark)', fontSize: '0.875rem' }}>
            <AlertTriangle size={14} color={flagCritical ? '#dc2626' : 'var(--text-secondary)'} /> Flag Critical Case
          </div>
          <button type="button" onClick={() => setFlagCritical(!flagCritical)}
            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: `1px solid ${flagCritical ? '#dc2626' : 'var(--border)'}`, background: flagCritical ? '#dc2626' : 'var(--surface)', color: flagCritical ? 'white' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
            {flagCritical ? 'Flagged as Critical ✓' : 'Mark as Critical'}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={!diagnosis.trim() || isLoading}
        style={{ padding: '0.875rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem', cursor: !diagnosis.trim() ? 'not-allowed' : 'pointer', opacity: !diagnosis.trim() ? 0.6 : 1 }}>
        {isLoading ? 'Saving...' : '✓ Mark Consultation Complete'}
      </button>
    </form>
  );
};