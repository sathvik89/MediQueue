import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Calendar, Bell, Clock, History, Search
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { QueueWidget } from '../../components/patient/QueueWidget';
import { AppointmentTable } from '../../components/patient/AppointmentTable';
import { DoctorCard } from '../../components/patient/DoctorCard';
import { BookingModal } from '../../components/patient/BookingModal';
import { NotificationList } from '../../components/patient/NotificationList';
import { HistoryTable } from '../../components/patient/HistoryTable';
import { PageHeader, StatCard } from '../../components/ui/index';
import {
  getDoctors, getAppointments, getNotifications, getMedicalHistory,
  bookAppointment, cancelAppointment, markNotificationRead
} from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';
import type { Doctor, Appointment, Notification, MedicalRecord, AppointmentType, CasePriority } from '../../types';
import './index.css';

type TabId = 'overview' | 'appointments' | 'book' | 'notifications' | 'history';

const NAV_ITEMS = [
  { id: 'overview' as TabId, label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments' as TabId, label: 'My Appointments', icon: Calendar },
  { id: 'book' as TabId, label: 'Find a Doctor', icon: Search },
  { id: 'notifications' as TabId, label: 'Notifications', icon: Bell },
  { id: 'history' as TabId, label: 'Medical History', icon: History },
];

const PAGE_TITLES: Record<TabId, string> = {
  overview: 'Patient Overview',
  appointments: 'My Appointments',
  book: 'Find a Doctor',
  notifications: 'Notifications',
  history: 'Medical History',
};

export const PatientDashboard: React.FC = () => {
  const { authState } = useAuth();
  const user = authState.user;

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  const unread = notifications.filter(n => !n.isRead).length;

  const fetchAll = useCallback(async () => {
    try {
      const [docs, appts, notifs, history] = await Promise.all([
        getDoctors(), getAppointments(), getNotifications(), getMedicalHistory()
      ]);
      setDoctors(docs);
      setAppointments(appts);
      setNotifications(notifs);
      setMedicalHistory(history);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleBookClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (payload: {
    doctorId: string; date: string; time: string;
    type: AppointmentType; reasonForVisit: string; priority?: CasePriority;
  }) => {
    const toastId = toast.loading('Booking your appointment...');
    try {
      await bookAppointment(payload);
      toast.success(`Appointment booked! Token assigned.`, { id: toastId });
      await fetchAll();
      setActiveTab('appointments');
    } catch (err: any) {
      toast.error(err.message || 'Booking failed', { id: toastId });
      throw err;
    }
  };

  const handleCancelAppointment = async (id: string) => {
    const toastId = toast.loading('Cancelling...');
    try {
      await cancelAppointment(id);
      toast.success('Appointment cancelled', { id: toastId });
      await fetchAll();
    } catch {
      toast.error('Failed to cancel appointment', { id: toastId });
    }
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const specialties = [...new Set(doctors.map(d => d.specialty))].sort();
  const filteredDoctors = doctors.filter(d =>
    !specialtyFilter || d.specialty === specialtyFilter
  );

  const upcoming = appointments.filter(a => ['CONFIRMED', 'IN_QUEUE', 'PENDING'].includes(a.status));
  const completed = appointments.filter(a => a.status === 'COMPLETED');

  const navWithBadges = NAV_ITEMS.map(item =>
    item.id === 'notifications' ? { ...item, badge: unread || undefined } : item
  );

  if (loading) {
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
      navItems={navWithBadges}
      activeNav={activeTab}
      onNavChange={(id) => setActiveTab(id as TabId)}
      pageTitle={PAGE_TITLES[activeTab]}
      unreadNotifications={unread}
      onNotifClick={() => setActiveTab('notifications')}
    >
      {/* ─── Overview ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Greeting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 0.25rem' }}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <StatCard label="Upcoming" value={upcoming.length} sublabel="appointments" icon={Calendar} />
            <StatCard label="Completed" value={completed.length} sublabel="consultations" icon={Clock} color="#047857" />
            <StatCard label="Unread" value={unread} sublabel="notifications" icon={Bell} color={unread > 0 ? '#dc2626' : 'var(--primary)'} />
          </div>

          {/* Live Queue */}
          <QueueWidget />

          {/* Upcoming Appointments (short list) */}
          <div>
            <PageHeader title="Upcoming Appointments"
              action={
                <button onClick={() => setActiveTab('appointments')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                  View all →
                </button>
              }
            />
            <AppointmentTable appointments={upcoming.slice(0, 3)} onCancel={handleCancelAppointment} />
          </div>

          {/* Recent Notifications */}
          {unread > 0 && (
            <div>
              <PageHeader title="Recent Notifications"
                action={
                  <button onClick={() => setActiveTab('notifications')}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                    View all →
                  </button>
                }
              />
              <NotificationList notifications={notifications.filter(n => !n.isRead).slice(0, 3)} onMarkRead={handleMarkRead} />
            </div>
          )}
        </div>
      )}

      {/* ─── My Appointments ──────────────────────────────────── */}
      {activeTab === 'appointments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PageHeader title="My Appointments" subtitle={`${appointments.length} total appointments`}
            action={
              <button onClick={() => setActiveTab('book')}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.5rem', padding: '0.625rem 1.25rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                + Book New
              </button>
            }
          />
          <AppointmentTable appointments={appointments} onCancel={handleCancelAppointment} />
        </div>
      )}

      {/* ─── Find a Doctor ─────────────────────────────────────── */}
      {activeTab === 'book' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PageHeader title="Find a Doctor" subtitle="Select a specialist and book your appointment" />

          {/* Specialty filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setSpecialtyFilter('')}
              style={{ padding: '0.4rem 0.875rem', borderRadius: '0.5rem', border: '1px solid', borderColor: specialtyFilter === '' ? 'var(--primary)' : 'var(--border)', background: specialtyFilter === '' ? 'var(--primary-light)' : 'var(--surface)', color: specialtyFilter === '' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
              All Specialties
            </button>
            {specialties.map(sp => (
              <button key={sp} onClick={() => setSpecialtyFilter(sp)}
                style={{ padding: '0.4rem 0.875rem', borderRadius: '0.5rem', border: '1px solid', borderColor: specialtyFilter === sp ? 'var(--primary)' : 'var(--border)', background: specialtyFilter === sp ? 'var(--primary-light)' : 'var(--surface)', color: specialtyFilter === sp ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer' }}>
                {sp}
              </button>
            ))}
          </div>

          {/* Doctor Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {filteredDoctors.map(doc => (
              <DoctorCard key={doc.id} doctor={doc} onBook={handleBookClick} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Notifications ─────────────────────────────────────── */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PageHeader title="Notifications" subtitle={`${unread} unread`} />
          <NotificationList notifications={notifications} onMarkRead={handleMarkRead} />
        </div>
      )}

      {/* ─── Medical History ───────────────────────────────────── */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PageHeader title="Medical History" subtitle={`${medicalHistory.length} past records`} />
          <HistoryTable records={medicalHistory} />
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </DashboardLayout>
  );
};
