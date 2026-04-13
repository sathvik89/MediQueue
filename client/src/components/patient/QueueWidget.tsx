import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getQueueStatus } from '../../services/patientService';
import type { QueueStatus } from '../../types';
import './QueueWidget.css';

export const QueueWidget: React.FC = () => {
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Poll the queue status every 10 seconds to simulate real-time updates
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const data = await getQueueStatus();
        setStatus(data);
      } catch (err) {
        console.error("Failed to fetch queue status", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus(); // Initial fetch

    // Poll every 10 seconds for demo purposes
    intervalId = setInterval(fetchStatus, 10000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="queue-widget">Loading queue status...</div>;
  }

  if (!status) return null;

  return (
    <div className="queue-widget">
      <div className="queue-header">
        <Clock size={20} className="text-primary" />
        <h2>Live Queue Status</h2>
        <div className="live-indicator" title="Live updates active"></div>
      </div>
      
      <div className="queue-stats">
        <div className="stat-item">
          <span className="stat-label">Your Position</span>
          <span className="stat-value highlight">#{status.position}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Estimated Wait</span>
          <span className="stat-value">{status.estimatedWaitTime} min</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-label">Currently Serving</span>
          <span className="stat-value" style={{ color: 'var(--text-dark)'}}>#{status.currentServing}</span>
        </div>
      </div>
    </div>
  );
};
