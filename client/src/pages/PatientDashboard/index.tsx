import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { QueueWidget } from '../../components/patient/QueueWidget';
import { AppointmentTable } from '../../components/patient/AppointmentTable';
import { DoctorCard } from '../../components/patient/DoctorCard';
import { BookingModal } from '../../components/patient/BookingModal';
import { getDoctors, getAppointments, bookAppointment, cancelAppointment } from '../../services/patientService';
import type { Doctor, Appointment } from '../../types';
import './index.css';

export const PatientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'book'>('overview');
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [docs, appts] = await Promise.all([getDoctors(), getAppointments()]);
      setDoctors(docs);
      setAppointments(appts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (doctorId: string, date: string, time: string) => {
    await bookAppointment(doctorId, date, time);
    await fetchData(); // simple refresh
    setActiveTab('overview');
  };

  const handleCancelAppointment = async (id: string) => {
    await cancelAppointment(id);
    await fetchData(); // simple refresh
  };

  if (loading) {
    return <DashboardLayout><div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="patient-dashboard-container">
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            Find a Doctor
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="tab-content">
            <QueueWidget />
            
            <h2 className="section-title">My Appointments</h2>
            <AppointmentTable appointments={appointments} onCancel={handleCancelAppointment} />
          </div>
        )}

        {activeTab === 'book' && (
          <div className="tab-content">
            <h2 className="section-title">Available Doctors</h2>
            <div className="doctors-grid">
              {doctors.map(doc => (
                <DoctorCard key={doc.id} doctor={doc} onBook={handleBookClick} />
              ))}
            </div>
          </div>
        )}

        {selectedDoctor && (
          <BookingModal 
            doctor={selectedDoctor} 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmBooking}
          />
        )}
        
      </div>
    </DashboardLayout>
  );
};
