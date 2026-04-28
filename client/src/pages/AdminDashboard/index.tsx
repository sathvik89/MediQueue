import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Users, Activity, Clock, ListChecks, Stethoscope, Plus } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { AddDoctorModal } from '../../components/admin/AddDoctorModal';
import { DoctorShowcase } from '../../components/admin/DoctorShowcase';
import { PatientListTable } from '../../components/admin/PatientListTable';
import { Button } from '../../components/Button';
import { PageHeader, StatCard, Skeleton } from '../../components/ui/index';
import { 
  getSystemStats, getAllDoctors, addDoctor, removeDoctor, toggleDoctorStatus, getAllPatients
} from '../../services/adminService';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import type { SystemStats } from '../../services/adminService';
import type { Doctor, PatientAdminView } from '../../types';
import './index.css';

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type TabId = 'overview' | 'doctors' | 'patients' | 'settings';

const NAV_ITEMS = [
  { id: 'overview' as TabId, label: 'Overview', icon: Activity },
  { id: 'doctors' as TabId, label: 'Doctors', icon: Stethoscope },
  { id: 'patients' as TabId, label: 'Patients', icon: Users },
  { id: 'settings' as TabId, label: 'Settings', icon: ListChecks },
];

const PAGE_TITLES: Record<TabId, string> = {
  overview: 'System Overview',
  doctors: 'Doctor Roster',
  patients: 'Patient Directory',
  settings: 'System Settings',
};

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [stats, setStats] = useState<SystemStats | null>(null);
  
  // Doctor State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Patient State
  const [patients, setPatients] = useState<PatientAdminView[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [patientSort, setPatientSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, docs, pats] = await Promise.all([
        getSystemStats(), 
        getAllDoctors(),
        getAllPatients(patientSearch, patientSort)
      ]);
      setStats(s);
      setDoctors(docs);
      setPatients(pats);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [patientSearch, patientSort]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAddDoctor = async (name: string, specialty: string) => {
    const toastId = toast.loading('Adding doctor...');
    try {
      await addDoctor(name, specialty);
      await fetchDashboardData();
      toast.success('Doctor added successfully', { id: toastId });
    } catch {
      toast.error('Failed to add doctor', { id: toastId });
    }
  };

  const handleRemoveDoctor = async (id: string) => {
    try {
      await removeDoctor(id);
      await fetchDashboardData();
      toast.success('Doctor removed from system');
    } catch {
      toast.error('Failed to remove doctor');
    }
  };

  const handleToggleDoctorStatus = async (id: string) => {
    try {
      await toggleDoctorStatus(id);
      await fetchDashboardData();
      toast.success('Doctor status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={NAV_ITEMS} activeNav={activeTab} onNavChange={(id) => setActiveTab(id as TabId)} pageTitle={PAGE_TITLES[activeTab]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {[1, 2, 3, 4].map(i => <Skeleton key={i} height="100px" />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <Skeleton height="350px" />
            <Skeleton height="350px" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Skeleton height="200px" />
            <Skeleton height="200px" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      navItems={NAV_ITEMS}
      activeNav={activeTab}
      onNavChange={(id) => setActiveTab(id as TabId)}
      pageTitle={PAGE_TITLES[activeTab]}
    >
      <div className="admin-dashboard-wrapper">
        
        {/* ─── Header Section ────────────────────────────────────────── */}
        <section className="dashboard-hero">
          <div className="hero-content">
            <h1 className="hero-greeting">Welcome back, Admin</h1>
            <p className="hero-subtitle">System is stable. You have 0 pending critical alerts.</p>
          </div>
          <div className="hero-actions">
            <span className="current-date">
              <Clock size={16} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </section>

        {/* ─── Overview Tab ────────────────────────────────────────────── */}
        {activeTab === 'overview' && stats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <StatCard label="Total Patients" value={stats.totalPatients} sublabel="Registered Users" icon={Users} color="#3b82f6" />
              <StatCard label="Active Doctors" value={stats.activeDoctors} sublabel="Available Now" icon={Stethoscope} color="#10b981" />
              <StatCard label="Wait Time" value={`${stats.averageWaitTime}m`} sublabel="System Average" icon={Clock} color="#f59e0b" />
              <StatCard label="Today's Stats" value={stats.totalPatientsToday} sublabel="New Walk-ins" icon={Activity} color="#ef4444" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)' }}>Appointment Volume (Last 7 Days)</h3>
                <div style={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.appointmentTrends}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                        tickFormatter={(str) => {
                          const date = new Date(str);
                          return date.toLocaleDateString('en-US', { weekday: 'short' });
                        }}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                      <Tooltip 
                        contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)' }}>Patient Activity</h3>
                <div style={{ flex: 1, minHeight: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.distribution}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.distribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Recent System Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { type: 'success', msg: 'System Backup completed successfully', time: '2 hours ago' },
                    { type: 'warning', msg: 'Dr. Emily schedule conflict detected', time: '5 hours ago' },
                    { type: 'info', msg: 'New doctor specialization added: Oncology', time: 'Yesterday' }
                  ].map((alert, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingBottom: i < 2 ? '0.75rem' : 0, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: alert.type === 'success' ? '#10b981' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{alert.msg}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Button variant="outline" fullWidth onClick={() => setActiveTab('doctors')}>Manage Roster</Button>
                  <Button variant="outline" fullWidth onClick={() => setActiveTab('settings')}>System Config</Button>
                  <Button variant="outline" fullWidth onClick={() => setActiveTab('patients')}>Patient Directory</Button>
                  <Button variant="outline" fullWidth>Generate Report</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Doctors Tab ─────────────────────────────────────────────── */}
        {activeTab === 'doctors' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <PageHeader title="Doctor Management" subtitle="Manage hospital staff roster and active status" />
              <Button onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Plus size={18} />
                Register New Doctor
              </Button>
            </div>
            
            <DoctorShowcase 
              doctors={doctors} 
              onToggleStatus={handleToggleDoctorStatus} 
              onRemove={handleRemoveDoctor} 
            />
          </div>
        )}

        {/* ─── Patients Tab ────────────────────────────────────────────── */}
        {activeTab === 'patients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PageHeader title="Patient Directory" subtitle="Search and manage registered patients" />
            
            <PatientListTable 
              patients={patients}
              searchQuery={patientSearch}
              onSearchChange={setPatientSearch}
              sortBy={patientSort}
              onSortChange={setPatientSort}
            />
          </div>
        )}

        {/* ─── Settings Tab ────────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <PageHeader title="System Settings" subtitle="Configure global hospital management parameters" />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)' }}>Registration Control</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>New Patient Registration</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Allow new users to create accounts</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: '999px', background: 'var(--primary)', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Doctor Registration</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Public access to doctor sign-up portal</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: '999px', background: 'var(--border)', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: 'white' }} />
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)' }}>Queue Parameters</h3>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Average Consultation Time (Minutes)</label>
                  <input type="number" defaultValue={15} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-color)', fontSize: '0.9rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Emergency Mode</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>
                <Button fullWidth style={{ marginTop: '1rem', background: '#dc2626', borderColor: '#dc2626' }}>
                  Activate Emergency Protocol
                </Button>
              </div>
            </div>
          </div>
        )}
        
      </div>

      <AddDoctorModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddDoctor} 
      />
    </DashboardLayout>
  );
};
