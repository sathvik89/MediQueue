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
import { PageHeader, StatCard, EmptyState, Skeleton } from '../../components/ui/index';
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

const SPECIALTY_ICONS: Record<string, string> = {
  'General physician': 'https://cdn-icons-png.flaticon.com/512/2785/2785482.png',
  'Gynecologist': 'https://cdn-icons-png.flaticon.com/512/2808/2808381.png',
  'Dermatologist': 'https://cdn-icons-png.flaticon.com/512/2808/2808375.png',
  'Pediatricians': 'https://cdn-icons-png.flaticon.com/512/2808/2808390.png',
  'Neurologist': 'https://cdn-icons-png.flaticon.com/512/2808/2808401.png',
  'Gastroenterologist': 'https://cdn-icons-png.flaticon.com/512/2808/2808413.png',
  'Cardiologist': 'https://cdn-icons-png.flaticon.com/512/2808/2808370.png',
};

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

  useEffect(() => { 
    fetchAll(); 
  }, [fetchAll]);

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
      <DashboardLayout navItems={navWithBadges} activeNav={activeTab} onNavChange={(id) => setActiveTab(id as TabId)} pageTitle={PAGE_TITLES[activeTab]}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <Skeleton height="120px" />
            <Skeleton height="120px" />
            <Skeleton height="120px" />
          </div>
          <Skeleton height="200px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </div>
        </div>
      </DashboardLayout>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* ── Hero Greeting Banner ── */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
            borderRadius: '1.25rem',
            padding: '2rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 12px 32px -6px rgba(37, 99, 235, 0.3)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* bg circles */}
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -60, right: 80 }} />
            <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', bottom: -50, right: 20 }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.3)' }} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Your Health Dashboard
                </span>
              </div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', margin: '0 0 0.5rem', lineHeight: 1.2 }}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9375rem', margin: 0 }}>
                {upcoming.length > 0
                  ? `You have ${upcoming.length} upcoming appointment${upcoming.length > 1 ? 's' : ''}. Stay on top of your health!`
                  : 'No upcoming appointments. Book one to stay proactive about your health.'}
              </p>
            </div>

            {/* Date Badge */}
            <div style={{
              position: 'relative', zIndex: 1,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              borderRadius: '1rem',
              padding: '1.25rem 1.5rem',
              textAlign: 'center',
              minWidth: '140px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                {new Date().getDate()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: '0.25rem' }}>
                {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
              </div>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
              Quick Actions
            </div>
            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Book Appointment', icon: '🩺', tab: 'book', color: '#3b82f6' },
                { label: 'My Appointments', icon: '📋', tab: 'appointments', color: '#10b981' },
                { label: 'Medical History', icon: '📂', tab: 'history', color: '#8b5cf6' },
                { label: 'Notifications', icon: '🔔', tab: 'notifications', color: unread > 0 ? '#ef4444' : '#64748b', badge: unread > 0 ? unread : undefined },
              ].map(action => (
                <button
                  key={action.tab}
                  onClick={() => setActiveTab(action.tab as TabId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-dark)',
                    transition: 'all 0.18s ease',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = action.color; (e.currentTarget as HTMLButtonElement).style.color = action.color; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dark)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: '1.125rem' }}>{action.icon}</span>
                  {action.label}
                  {action.badge && (
                    <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 700, padding: '0.1rem 0.45rem', lineHeight: 1.5 }}>
                      {action.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {[
              { label: 'Upcoming Appointments', value: upcoming.length, sublabel: upcoming.length === 1 ? '1 scheduled' : `${upcoming.length} scheduled`, icon: Calendar, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Completed Visits', value: completed.length, sublabel: 'Total consultations', icon: Clock, color: '#10b981', bg: '#f0fdf4' },
              { label: 'Notifications', value: unread, sublabel: unread > 0 ? 'Require attention' : 'All caught up', icon: Bell, color: unread > 0 ? '#ef4444' : '#64748b', bg: unread > 0 ? '#fef2f2' : '#f8fafc' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'box-shadow 0.2s',
                }}>
                  <div style={{
                    width: 52, height: 52,
                    borderRadius: '0.875rem',
                    background: stat.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)', marginTop: '0.25rem' }}>{stat.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>{stat.sublabel}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Queue Widget ── */}
          <QueueWidget />

          {/* ── Upcoming Appointments Preview ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)' }}>Upcoming Appointments</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {upcoming.length > 0 ? `You have ${upcoming.length} scheduled visit${upcoming.length > 1 ? 's' : ''}` : 'No upcoming appointments scheduled'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}
              >
                View all →
              </button>
            </div>

            {upcoming.length === 0 ? (
              <div style={{
                background: 'var(--surface)',
                border: '2px dashed var(--border)',
                borderRadius: '1rem',
                padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗓️</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>No Upcoming Appointments</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Book your first appointment with one of our trusted doctors</div>
                <button
                  onClick={() => setActiveTab('book')}
                  style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.625rem', padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Find a Doctor
                </button>
              </div>
            ) : (
              <AppointmentTable appointments={upcoming.slice(0, 3)} onCancel={handleCancelAppointment} />
            )}
          </div>

          {/* ── Unread Notifications ── */}
          {unread > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Unread Notifications
                    <span style={{ marginLeft: '0.5rem', background: '#ef4444', color: 'white', borderRadius: '999px', fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', verticalAlign: 'middle' }}>
                      {unread}
                    </span>
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Action required</p>
                </div>
                <button
                  onClick={() => setActiveTab('notifications')}
                  style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8125rem', cursor: 'pointer', borderRadius: '0.5rem', padding: '0.5rem 1rem' }}
                >
                  View all →
                </button>
              </div>
              <NotificationList notifications={notifications.filter(n => !n.isRead).slice(0, 3)} onMarkRead={handleMarkRead} />
            </div>
          )}

          {/* ── Wellness Tip Strip ── */}
          {(() => {
            const tips = [
              { icon: '💧', text: 'Drink 8 glasses of water daily to stay energized and support kidney health.' },
              { icon: '🚶', text: 'A 30-minute walk each day significantly reduces risk of heart disease.' },
              { icon: '😴', text: '7–9 hours of quality sleep helps your body heal and your mind stay sharp.' },
              { icon: '🥦', text: 'Eating greens daily boosts immunity and keeps your gut healthy.' },
              { icon: '🧘', text: '5 minutes of deep breathing can lower stress levels dramatically.' },
            ];
            const tip = tips[new Date().getDay() % tips.length];
            return (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.5rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderLeft: '4px solid #10b981',
                borderRadius: '0.875rem',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{tip.icon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Daily Wellness Tip
                  </span>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: 'var(--text-dark)', fontWeight: 500, lineHeight: 1.5 }}>
                    {tip.text}
                  </p>
                </div>
              </div>
            );
          })()}

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <PageHeader title="Top Doctors to Book" subtitle="Simply browse through our extensive list of trusted doctors and book your appointment with ease." />
          </div>

          {/* Specialty Interactive Grid */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            padding: '1rem 0'
          }}>
            {Object.entries(SPECIALTY_ICONS).map(([name, icon]) => (
              <button
                key={name}
                onClick={() => setSpecialtyFilter(prev => prev === name ? '' : name)}
                style={{
                  background: 'var(--surface)',
                  border: `2px solid ${specialtyFilter === name ? 'var(--primary)' : 'transparent'}`,
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  width: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: specialtyFilter === name ? '0 8px 20px -4px rgba(59, 130, 246, 0.2)' : 'var(--shadow-sm)',
                  transform: specialtyFilter === name ? 'translateY(-4px)' : 'none'
                }}
              >
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem'
                }}>
                  <img src={icon} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ 
                  fontSize: '0.8125rem', 
                  fontWeight: 700, 
                  color: specialtyFilter === name ? 'var(--primary)' : 'var(--text-dark)',
                  textAlign: 'center'
                }}>
                  {name}
                </span>
              </button>
            ))}
          </div>

          {/* Doctor Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              {specialtyFilter ? `${specialtyFilter} Specialists` : 'All Available Doctors'}
            </h3>
            {filteredDoctors.length === 0 ? (
              <EmptyState 
                icon={Search} 
                title="No doctors found" 
                description={specialtyFilter ? `We couldn't find any ${specialtyFilter} specialists at the moment.` : "No medical specialists are available right now."} 
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {filteredDoctors.map(doc => (
                  <DoctorCard key={doc.id} doctor={doc} onBook={handleBookClick} />
                ))}
              </div>
            )}
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
