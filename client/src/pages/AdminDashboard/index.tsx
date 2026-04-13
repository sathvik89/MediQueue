import React, { useState, useEffect } from 'react';
import { Users, Activity, Clock, ListChecks, Plus } from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { StatCard } from '../../components/admin/StatCard';
import { DoctorManagementTable } from '../../components/admin/DoctorManagementTable';
import { AddDoctorModal } from '../../components/admin/AddDoctorModal';
import { ConflictResolver } from '../../components/admin/ConflictResolver';
import { Button } from '../../components/Button';
import { getSystemStats, getAllDoctors, addDoctor, removeDoctor } from '../../services/adminService';
import type { SystemStats } from '../../services/adminService';
import type { Doctor } from '../../types';
import './index.css';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const [s, docs] = await Promise.all([getSystemStats(), getAllDoctors()]);
    setStats(s);
    setDoctors(docs);
  };

  const handleAddDoctor = async (name: string, specialty: string) => {
    await addDoctor(name, specialty);
    await fetchDashboardData();
  };

  const handleRemoveDoctor = async (id: string) => {
    await removeDoctor(id);
    await fetchDashboardData();
  };

  return (
    <DashboardLayout>
      <div className="admin-dashboard-container">
        
        {/* Statistics Row */}
        <div className="stats-grid">
          <StatCard 
            title="Total Patients (Today)" 
            value={stats?.totalPatientsToday ?? '--'} 
            icon={<Users size={24} />} 
          />
          <StatCard 
            title="Active Doctors" 
            value={stats?.activeDoctors ?? '--'} 
            icon={<Activity size={24} />} 
          />
          <StatCard 
            title="Average Wait Time" 
            value={stats ? `${stats.averageWaitTime} min` : '--'} 
            icon={<Clock size={24} />} 
          />
          <StatCard 
            title="Total Appointments" 
            value={stats?.totalAppointments ?? '--'} 
            icon={<ListChecks size={24} />} 
          />
        </div>

        {/* Doctor Management */}
        <div className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Doctor Roster</h2>
            <Button onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Plus size={18} />
              Add Doctor
            </Button>
          </div>
          <DoctorManagementTable doctors={doctors} onRemove={handleRemoveDoctor} />
        </div>

        {/* Conflict Resolution Placeholder */}
        <div className="admin-section">
          <div className="section-header">
            <h2 className="section-title">Scheduling Warnings</h2>
          </div>
          <ConflictResolver />
        </div>
        
      </div>

      <AddDoctorModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddDoctor} 
      />
    </DashboardLayout>
  );
};
