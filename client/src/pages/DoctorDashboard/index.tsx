import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, Calendar, BarChart2, Stethoscope } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { DoctorQueueList } from '../../components/doctor/DoctorQueueList';
import { PatientConsultationPanel } from '../../components/doctor/PatientConsultationPanel';
import { AvailabilityControl } from '../../components/doctor/AvailabilityControl';
import { PageHeader, StatCard } from '../../components/ui/index';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  getDoctorQueue, callNextPatient, completeConsultation, skipPatient,
  flagCriticalCase, setQueueStrategy, getQueueStrategy,
  getDoctorStatus, setDoctorStatus, getWorkloadSummary
} from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import type { PatientConsultation, WorkloadSummary, QueueStrategy, AvailabilityStatus } from '../../types';
import './index.css';

type TabId = 'queue' | 'availability' | 'workload';

const NAV_ITEMS = [
  { id: 'queue' as TabId,       label: 'Active Queue',     icon: Users },
  { id: 'availability' as TabId, label: 'Availability',   icon: Calendar },
  { id: 'workload' as TabId,    label: 'Daily Workload',   icon: BarChart2 },
];

const PAGE_TITLES: Record<TabId, string> = {
  queue:        'Active Queue',
  availability: 'My Availability',
  workload:     'Daily Workload',
};

export const DoctorDashboard: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;

  const [activeTab, setActiveTab] = useState<TabId>('queue');
  const [queue, setQueue] = useState<PatientConsultation[]>([]);
  const [activePatient, setActivePatient] = useState<PatientConsultation | null>(null);
  const [strategy, setStrategy] = useState<QueueStrategy>('FIFO');
  const [doctorStatus, setDoctorStatusState] = useState<AvailabilityStatus>('AVAILABLE');
  const [workload, setWorkload] = useState<WorkloadSummary | null>(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [callingNext, setCallingNext] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [q, strat, status, wl] = await Promise.all([
        getDoctorQueue(), getQueueStrategy(), getDoctorStatus(), getWorkloadSummary()
      ]);
      setQueue(q);
      setStrategy(strat);
      setDoctorStatusState(status);
      setWorkload(wl);
      const current = q.find(p => p.status === 'in-progress');
      if (current) setActivePatient(current);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingQueue(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCallNext = async () => {
    setCallingNext(true);
    try {
      const next = await callNextPatient();
      if (next) {
        setActivePatient(next);
        toast.success(`Calling ${next.patientName} (Token #${next.tokenNumber})`);
      } else {
        toast('Queue is empty', { icon: '📭' });
      }
      await fetchAll();
    } catch {
      toast.error('Failed to call next patient');
    } finally {
      setCallingNext(false);
    }
  };

  const handleComplete = async (_data: { medicines: string[]; diagnosis: string; notes: string; followUpDate?: string; isCritical: boolean }) => {
    if (!activePatient) return;
    const toastId = toast.loading('Saving consultation...');
    try {
      await completeConsultation(activePatient.id);
      setActivePatient(null);
      await fetchAll();
      toast.success(`Consultation saved for ${activePatient.patientName}`, { id: toastId });
    } catch {
      toast.error('Failed to complete consultation', { id: toastId });
    }
  };

  const handleSkip = async (id: string) => {
    try {
      await skipPatient(id);
      const patient = queue.find(p => p.id === id);
      toast.success(`${patient?.patientName} moved to end of queue`);
      await fetchAll();
    } catch {
      toast.error('Failed to skip patient');
    }
  };

  const handleFlagCritical = async (id: string) => {
    try {
      await flagCriticalCase(id);
      const patient = queue.find(p => p.id === id);
      toast.success(`${patient?.patientName} flagged as critical & prioritized`, { icon: '🚨' });
      await fetchAll();
    } catch {
      toast.error('Failed to flag case');
    }
  };

  const handleStrategyChange = async (s: QueueStrategy) => {
    try {
      await setQueueStrategy(s);
      setStrategy(s);
      toast.success(`Queue strategy changed to ${s}`);
      await fetchAll();
    } catch {
      toast.error('Failed to update strategy');
    }
  };

  const handleStatusChange = async (status: AvailabilityStatus) => {
    setStatusLoading(true);
    try {
      await setDoctorStatus(status);
      setDoctorStatusState(status);
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const waiting = queue.filter(q => q.status === 'waiting').length;
  const completed = queue.filter(q => q.status === 'completed').length;

  if (loadingQueue) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      activeNav={activeTab}
      onNavChange={(id) => setActiveTab(id as TabId)}
      pageTitle={PAGE_TITLES[activeTab]}
      unreadNotifications={0}
    >
      {/* ─── Queue Panel ──────────────────────────────────────── */}
      {activeTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Doctor Banner */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
              <Stethoscope size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--text-dark)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
            <StatusBadge variant={doctorStatus} />
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <StatCard label="Waiting" value={waiting} sublabel="patients in queue" icon={Users} />
            <StatCard label="Completed" value={completed} sublabel="today" icon={LayoutDashboard} color="#047857" />
            <StatCard label="Strategy" value={strategy.replace('_', ' ')} sublabel="active" icon={BarChart2} color="#5b21b6" />
          </div>

          {/* Two-column layout: Queue | Consultation */}
          <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <DoctorQueueList
              queue={queue}
              onCallNext={handleCallNext}
              onSkip={handleSkip}
              onFlagCritical={handleFlagCritical}
              isLoading={callingNext}
              strategy={strategy}
              onStrategyChange={handleStrategyChange}
            />
            <div>
              <PageHeader title="Consultation Panel" subtitle={activePatient ? `Active: ${activePatient.patientName}` : 'No active patient'} />
              <PatientConsultationPanel patient={activePatient} onComplete={handleComplete} />
            </div>
          </div>
        </div>
      )}

      {/* ─── Availability ──────────────────────────────────────── */}
      {activeTab === 'availability' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PageHeader title="Availability Settings" subtitle="Manage your schedule and status" />
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)' }}>Current Status</h3>
              <AvailabilityControl status={doctorStatus} onChange={handleStatusChange} isLoading={statusLoading} />
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)' }}>Today's Schedule</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(slot => (
                  <div key={slot} style={{ padding: '0.625rem', textAlign: 'center', borderRadius: '0.5rem', background: 'var(--bg-color)', border: '1px solid var(--border)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                    {slot}
                  </div>
                ))}
              </div>
              <p style={{ margin: '1rem 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Slot management is handled by the admin. Contact admin to modify your time slots.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Workload / Daily Summary ──────────────────────────── */}
      {activeTab === 'workload' && workload && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PageHeader title="Daily Workload Summary" subtitle={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <StatCard label="Total Consultations" value={workload.totalConsultations} icon={Users} />
            <StatCard label="Completed" value={workload.completedAppointments} icon={LayoutDashboard} color="#047857" />
            <StatCard label="Cancelled" value={workload.cancelledAppointments} icon={Calendar} color="#dc2626" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <StatCard label="Flagged Cases" value={workload.flaggedCases} sublabel="Critical cases today" icon={BarChart2} color="#dc2626" />
            <StatCard label="Avg. Consultation" value={`${workload.averageConsultationMinutes} min`} sublabel="per patient" icon={LayoutDashboard} color="#5b21b6" />
          </div>

          {/* Progress bar visualization */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.875rem', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, color: 'var(--text-dark)', fontSize: '1rem' }}>Completion Rate</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-dark)' }}>Patients Seen</span>
                <span style={{ color: 'var(--primary)' }}>{workload.completedAppointments} / {workload.totalConsultations}</span>
              </div>
              <div style={{ background: 'var(--bg-color)', borderRadius: '999px', height: 10 }}>
                <div style={{
                  width: `${(workload.completedAppointments / workload.totalConsultations) * 100}%`,
                  height: '100%', background: 'var(--primary)', borderRadius: '999px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-dark)' }}>Critical Cases</span>
                <span style={{ color: '#dc2626' }}>{workload.flaggedCases} flagged</span>
              </div>
              <div style={{ background: 'var(--bg-color)', borderRadius: '999px', height: 10 }}>
                <div style={{
                  width: `${(workload.flaggedCases / workload.totalConsultations) * 100}%`,
                  height: '100%', background: '#dc2626', borderRadius: '999px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
