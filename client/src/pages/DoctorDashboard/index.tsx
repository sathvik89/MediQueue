import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { DoctorQueueList } from '../../components/doctor/DoctorQueueList';
import { PatientDetails } from '../../components/doctor/PatientDetails';
import { PrescriptionForm } from '../../components/doctor/PrescriptionForm';
import { AvailabilityScheduler } from '../../components/doctor/AvailabilityScheduler';
import { getDoctorQueue, callNextPatient, completeConsultation } from '../../services/doctorService';
import type { PatientConsultation } from '../../types';
import './index.css';

export const DoctorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultations' | 'schedule'>('consultations');
  const [queue, setQueue] = useState<PatientConsultation[]>([]);
  const [activePatient, setActivePatient] = useState<PatientConsultation | null>(null);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [callingNext, setCallingNext] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const q = await getDoctorQueue();
      setQueue(q);
      const current = q.find(p => p.status === 'in-progress');
      if (current) setActivePatient(current);
    } finally {
      setLoadingQueue(false);
    }
  };

  const handleCallNext = async () => {
    setCallingNext(true);
    try {
      const next = await callNextPatient();
      if (next) {
        setActivePatient(next);
      }
      await fetchQueue(); // Refresh list to reflect changes
    } finally {
      setCallingNext(false);
    }
  };

  const handleCompleteConsultation = async (notes: string) => {
    if (!activePatient) return;
    await completeConsultation(activePatient.id, notes);
    setActivePatient(null);
    await fetchQueue();
  };

  return (
    <DashboardLayout>
      <div className="doctor-dashboard-container">
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'consultations' ? 'active' : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            Active Consultations
          </button>
          <button 
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            My Schedule & Availability
          </button>
        </div>

        {activeTab === 'consultations' && (
          <div className="consultation-view">
            <aside className="queue-panel">
              <DoctorQueueList 
                queue={queue} 
                onCallNext={handleCallNext} 
                isLoading={loadingQueue || callingNext} 
              />
            </aside>
            <section className="interaction-panel">
              <PatientDetails patient={activePatient} />
              <PrescriptionForm patient={activePatient} onComplete={handleCompleteConsultation} />
            </section>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            <AvailabilityScheduler />
          </div>
        )}
        
      </div>
    </DashboardLayout>
  );
};
