import React, { useState, useEffect } from 'react';
import { getConflicts, resolveConflict } from '../../services/adminService';
import type { SchedulingConflict } from '../../services/adminService';
import { Button } from '../Button';
import './ConflictResolver.css';

export const ConflictResolver: React.FC = () => {
  const [conflicts, setConflicts] = useState<SchedulingConflict[]>([]);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    const data = await getConflicts();
    setConflicts(data);
  };

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      await resolveConflict(id);
      await fetchConflicts();
    } finally {
      setResolvingId(null);
    }
  };

  if (conflicts.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--success)', fontWeight: 500 }}>No Scheduling Conflicts</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>All appointments and provider schedules look good.</p>
      </div>
    );
  }

  return (
    <div className="conflict-list">
      {conflicts.map(conflict => (
        <div key={conflict.id} className="conflict-card">
          <div className="conflict-details">
            <h4>{conflict.doctorName}</h4>
            <p>Conflict at time: <strong>{conflict.timeSlot}</strong></p>
            <span className="conflict-type">{conflict.issue}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => handleResolve(conflict.id)}
            isLoading={resolvingId === conflict.id}
            disabled={resolvingId !== null && resolvingId !== conflict.id}
          >
            Resolve Automatically
          </Button>
        </div>
      ))}
    </div>
  );
};
