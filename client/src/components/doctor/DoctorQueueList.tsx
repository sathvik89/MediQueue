import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Hash, ArrowRightCircle, CheckCircle2, SkipForward } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/index';
import type { PatientConsultation, QueueStrategy } from '../../types';

interface DoctorQueueListProps {
  queue: PatientConsultation[];
  onCallNext: () => void;
  onSkip: (id: string) => void;
  onFlagCritical: (id: string) => void;
  isLoading: boolean;
  strategy: QueueStrategy;
  onStrategyChange: (s: QueueStrategy) => void;
}

const STRATEGIES: { value: QueueStrategy; label: string; desc: string }[] = [
  { value: 'FIFO',       label: 'FIFO',         desc: 'First in, first out' },
  { value: 'PRIORITY',   label: 'Priority',     desc: 'Highest priority first' },
  { value: 'ROUND_ROBIN',label: 'Round Robin',  desc: 'Balanced distribution' },
];

const priorityColor: Record<number, string> = { 1: '#6b7280', 2: '#1e40af', 3: '#b45309', 4: '#991b1b' };

export const DoctorQueueList: React.FC<DoctorQueueListProps> = ({
  queue, onCallNext, onSkip, onFlagCritical, isLoading, strategy, onStrategyChange
}) => {
  const waiting = queue.filter(q => q.status === 'waiting');
  const inProgress = queue.find(q => q.status === 'in-progress');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      {/* Strategy Selector (Strategy Pattern) */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Queue Strategy</span>
          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '999px' }}>Strategy Pattern</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {STRATEGIES.map(s => (
            <button key={s.value} onClick={() => onStrategyChange(s.value)}
              style={{
                flex: 1, padding: '0.5rem 0.25rem', border: `2px solid ${strategy === s.value ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: '0.5rem', background: strategy === s.value ? 'var(--primary-light)' : 'var(--surface)',
                color: strategy === s.value ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', textAlign: 'center', lineHeight: 1.3,
              }}>
              <div>{s.label}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.7, marginTop: '0.1rem' }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Header Stats + Call Next */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>Today's Queue</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{waiting.length} waiting</div>
          </div>
          <button onClick={onCallNext} disabled={waiting.length === 0 || isLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1rem',
              background: waiting.length === 0 ? 'var(--secondary)' : 'var(--primary)', color: 'white',
              border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.875rem',
              cursor: waiting.length === 0 ? 'not-allowed' : 'pointer',
            }}>
            <ArrowRightCircle size={16} />
            {isLoading ? 'Calling...' : 'Call Next'}
          </button>
        </div>
        {inProgress && (
          <div style={{ padding: '0.625rem', background: '#ede9fe', borderRadius: '0.5rem', border: '1px solid #c4b5fd', fontSize: '0.8125rem', fontWeight: 600, color: '#5b21b6', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', animation: 'pulse 1.5s ease infinite' }} />
            Now with: {inProgress.patientName} (#{inProgress.tokenNumber})
          </div>
        )}
      </div>

      {/* Queue Items */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', flex: 1, overflow: 'hidden' }}>
        {queue.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="Queue is empty" description="No patients waiting right now." />
        ) : (
          <div style={{ overflowY: 'auto', maxHeight: 520 }}>
            <AnimatePresence mode="popLayout">
              {queue.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    borderBottom: index < queue.length - 1 ? '1px solid var(--border)' : 'none',
                    background: patient.status === 'in-progress' ? '#f5f3ff' : patient.isCritical ? '#fff0f0' : 'transparent',
                  }}>
                  {/* Token */}
                  <div style={{ width: 40, height: 40, borderRadius: '0.5rem', background: patient.status === 'in-progress' ? '#ede9fe' : 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Hash size={10} color="var(--text-secondary)" />
                    <span style={{ fontWeight: 800, fontSize: '0.875rem', color: patient.status === 'in-progress' ? '#5b21b6' : 'var(--text-dark)', lineHeight: 1 }}>{patient.tokenNumber}</span>
                  </div>

                  {/* Name & Issue */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.patientName}</span>
                      {patient.isCritical && <AlertTriangle size={13} color="#dc2626" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient.issues || 'No reason given'}</div>
                  </div>

                  {/* Priority dot */}
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: priorityColor[patient.priority ?? 2], flexShrink: 0 }} title={`Priority ${patient.priority}`} />

                  {/* Status */}
                  <StatusBadge variant={patient.status === 'in-progress' ? 'IN_PROGRESS' : patient.status === 'completed' ? 'DONE' : 'WAITING'} size="sm" />

                  {/* Actions */}
                  {patient.status === 'waiting' && (
                    <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                      <button onClick={() => onSkip(patient.id)} title="Skip"
                        style={{ padding: '0.35rem', border: '1px solid var(--border)', borderRadius: '0.375rem', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <SkipForward size={13} />
                      </button>
                      {!patient.isCritical && (
                        <button onClick={() => onFlagCritical(patient.id)} title="Flag Critical"
                          style={{ padding: '0.35rem', border: '1px solid #fca5a5', borderRadius: '0.375rem', background: '#fee2e2', cursor: 'pointer', color: '#dc2626' }}>
                          <AlertTriangle size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
