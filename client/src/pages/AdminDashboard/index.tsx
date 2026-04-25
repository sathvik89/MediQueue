import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Users, Activity, Clock, ListChecks, Stethoscope, AlertTriangle, Plus } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/admin/StatCard';
import { AddDoctorModal } from '../../components/admin/AddDoctorModal';
import { ConflictResolver } from '../../components/admin/ConflictResolver';
import { DoctorShowcase } from '../../components/admin/DoctorShowcase';
import { PatientListTable } from '../../components/admin/PatientListTable';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/ui/index';
import { 
  getSystemStats, getAllDoctors, addDoctor, removeDoctor, toggleDoctorStatus, getAllPatients
} from '../../services/adminService';
import type { SystemStats } from '../../services/adminService';
import type { Doctor, PatientAdminView } from '../../types';
import './index.css';

type TabId = 'overview' | 'doctors' | 'patients';

const NAV_ITEMS = [
  { id: 'overview' as TabId, label: 'Overview', icon: Activity },
  { id: 'doctors' as TabId, label: 'Doctors', icon: Stethoscope },
  { id: 'patients' as TabId, label: 'Patients', icon: Users },
];

const PAGE_TITLES: Record<TabId, string> = {
  overview: 'System Overview',
  doctors: 'Doctor Roster',
  patients: 'Patient Directory',
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

  const fetchDashboardData = useCallback(async () => {
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
        {activeTab === 'overview' && (
          <div className="dashboard-content-grid">
            <div className="stats-header">
              <h2 className="section-title-v2">System Performance</h2>
              <div className="stats-badges">
                <span className="badge-live">Live</span>
              </div>
            </div>

            <div className="stats-grid">
              <StatCard 
                title="Total Patients (Today)" 
                value={stats?.totalPatientsToday ?? '--'} 
                icon={<Users size={24} />} 
                trend={{ value: 12, isUp: true }}
                delay={0.1}
              />
              <StatCard 
                title="Active Doctors" 
                value={stats?.activeDoctors ?? '--'} 
                icon={<Stethoscope size={24} />} 
                trend={{ value: 0, isUp: true }}
                delay={0.2}
              />
              <StatCard 
                title="Average Wait Time" 
                value={stats ? `${stats.averageWaitTime}m` : '--'} 
                icon={<Clock size={24} />} 
                trend={{ value: 5, isUp: false }}
                delay={0.3}
              />
              <StatCard 
                title="Total Appointments" 
                value={stats?.totalAppointments ?? '--'} 
                icon={<ListChecks size={24} />} 
                trend={{ value: 8, isUp: true }}
                delay={0.4}
              />
            </div>

            <div className="alerts-and-activity">
              <div className="alert-section-card">
                <div className="alert-header">
                  <div className="alert-title-group">
                    <div className="alert-icon-pulse">
                      <AlertTriangle size={20} />
                    </div>
                    <h3>Critical Scheduling Conflicts</h3>
                  </div>
                  <span className="alert-count">1 Active</span>
                </div>
                <div className="alert-body">
                  <ConflictResolver />
                </div>
              </div>

              <div className="activity-feed-card">
                <div className="activity-header">
                  <h3>Recent System Activity</h3>
                  <button className="text-btn">View All</button>
                </div>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-dot blue" />
                    <div className="activity-details">
                      <p><strong>New Doctor Registered:</strong> Dr. Sarah Wilson (Cardiology)</p>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-dot green" />
                    <div className="activity-details">
                      <p><strong>System Backup:</strong> Completed successfully</p>
                      <span>5 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-dot orange" />
                    <div className="activity-details">
                      <p><strong>Critical Alert:</strong> Dr. Emily Carter schedule conflict</p>
                      <span>Yesterday</span>
                    </div>
                  </div>
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
        
      </div>

      <AddDoctorModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddDoctor} 
      />
    </DashboardLayout>
  );
};
