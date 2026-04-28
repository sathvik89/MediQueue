import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, Hash, Stethoscope, RefreshCw } from 'lucide-react';
import { getQueueStatus } from '../../services/patientService';
import type { QueueStatus } from '../../types';

export const QueueWidget: React.FC = () => {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevPosition, setPrevPosition] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await getQueueStatus();
      setStatus(prev => {
        if (prev) setPrevPosition(prev.position);
        return data;
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (loading) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: 72, borderRadius: '0.625rem', background: 'var(--bg-color)', animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!status || status.position === 0) return null;

  const positionChanged = prevPosition !== null && prevPosition !== status.position;

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--primary) 0%, #2563eb 100%)',
      borderRadius: '0.875rem', padding: '1.5rem', color: 'white',
      boxShadow: '0 8px 20px -4px rgba(0, 86, 179, 0.35)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.3)' }} />
          Live Queue Status
        </div>
        <button
          onClick={() => fetchStatus(true)}
          title="Refresh"
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '0.375rem', padding: '0.375rem', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center' }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {/* Your Token */}
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.875rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Hash size={11} /> Your Token
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800 }}>#{status.tokenNumber}</div>
        </div>

        {/* Your Position */}
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.875rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Users size={11} /> Position
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={status.position}
              initial={{ y: positionChanged ? 12 : 0, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{ fontSize: '1.625rem', fontWeight: 800 }}
            >
              #{status.position}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Wait Time */}
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.875rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={11} /> Est. Wait
          </div>
          <div style={{ fontSize: '1.625rem', fontWeight: 800 }}>{status.estimatedWaitTime}<span style={{ fontSize: '0.875rem', fontWeight: 500, marginLeft: '0.25rem', opacity: 0.85 }}>min</span></div>
        </div>

        {/* Doctor */}
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.875rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Stethoscope size={11} /> Doctor
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.3 }}>{status.doctorName}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.375rem' }}>
          <span>Queue progress</span>
          <span>{status.totalWaiting} ahead</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '999px', height: 6 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(10, 100 - (status.position / (status.totalWaiting + 1)) * 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', background: '#4ade80', borderRadius: '999px' }}
          />
        </div>
      </div>
    </div>
  );
};
