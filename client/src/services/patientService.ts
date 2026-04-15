import type {
  Doctor, Appointment, QueueStatus, Notification, MedicalRecord, AppointmentType, CasePriority
} from '../types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology',
    availability: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'd2', name: 'Dr. Michael Chen', specialty: 'Neurology',
    availability: ['09:30', '11:30', '13:00', '16:00'],
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'd3', name: 'Dr. Emily Carter', specialty: 'General Practice',
    availability: ['08:00', '09:00', '10:30', '14:30', '15:30'],
    availabilityStatus: 'BUSY',
  },
  {
    id: 'd4', name: 'Dr. Rajesh Patel', specialty: 'Orthopaedics',
    availability: ['10:00', '11:00', '15:00', '16:30'],
    availabilityStatus: 'AVAILABLE',
  },
  {
    id: 'd5', name: 'Dr. Priya Nair', specialty: 'Dermatology',
    availability: ['09:00', '10:30', '13:30', '15:00'],
    availabilityStatus: 'ON_BREAK',
  },
  {
    id: 'd6', name: 'Dr. Anand Sharma', specialty: 'Paediatrics',
    availability: ['08:30', '10:00', '14:00', '16:00'],
    availabilityStatus: 'AVAILABLE',
  },
];

let mockAppointments: Appointment[] = [
  {
    id: 'a1', patientId: 'p1', doctorId: 'd1', doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology', date: new Date().toISOString().split('T')[0],
    time: '09:00', type: 'SCHEDULED', status: 'IN_QUEUE', priority: 2,
    tokenNumber: 42, reasonForVisit: 'Chest pain and shortness of breath', isCritical: false,
  },
  {
    id: 'a2', patientId: 'p1', doctorId: 'd3', doctorName: 'Dr. Emily Carter',
    specialty: 'General Practice', date: new Date().toISOString().split('T')[0],
    time: '10:30', type: 'WALK_IN', status: 'CONFIRMED', priority: 2,
    tokenNumber: 7, reasonForVisit: 'Routine annual checkup', isCritical: false,
  },
  {
    id: 'a3', patientId: 'p1', doctorId: 'd2', doctorName: 'Dr. Michael Chen',
    specialty: 'Neurology',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    time: '11:30', type: 'SCHEDULED', status: 'COMPLETED', priority: 2,
    reasonForVisit: 'Recurring migraines', isCritical: false,
  },
  {
    id: 'a4', patientId: 'p1', doctorId: 'd4', doctorName: 'Dr. Rajesh Patel',
    specialty: 'Orthopaedics',
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
    time: '15:00', type: 'SCHEDULED', status: 'COMPLETED', priority: 2,
    reasonForVisit: 'Knee pain follow-up', isCritical: false,
  },
];

const mockNotifications: Notification[] = [
  {
    id: 'n1', title: 'Your turn is approaching',
    body: 'You are next in queue for Dr. Sarah Jenkins. Please proceed to Room 3.',
    type: 'QUEUE_UPDATE', isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    appointmentId: 'a1',
  },
  {
    id: 'n2', title: 'Appointment Confirmed',
    body: 'Your appointment with Dr. Emily Carter at 10:30 AM has been confirmed.',
    type: 'APPOINTMENT_REMINDER', isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    appointmentId: 'a2',
  },
  {
    id: 'n3', title: 'Follow-up Reminder',
    body: 'Dr. Michael Chen has recommended a follow-up visit for your migraine treatment.',
    type: 'FOLLOW_UP', isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    appointmentId: 'a3',
  },
  {
    id: 'n4', title: 'System Maintenance',
    body: 'MediQueue will be down for maintenance from 2:00 AM – 4:00 AM tonight.',
    type: 'GENERAL', isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const mockMedicalHistory: MedicalRecord[] = [
  {
    id: 'mr1', doctorName: 'Dr. Michael Chen',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    diagnosis: 'Chronic Migraine',
    notes: 'Patient reports 2-3 migraine episodes per week. Triggers include stress and screen time.',
    prescription: { medicines: ['Sumatriptan 50mg', 'Propranolol 40mg'], notes: 'Take sumatriptan at onset. Propranolol daily as preventive.', issuedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
    followUpDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    isCritical: false,
  },
  {
    id: 'mr2', doctorName: 'Dr. Rajesh Patel',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    diagnosis: 'Mild Patellofemoral Pain Syndrome',
    notes: 'Right knee pain exacerbated by stairs and prolonged sitting. No structural damage on X-ray.',
    prescription: { medicines: ['Ibuprofen 400mg', 'Calcium supplement'], notes: 'Ice after activity. Physiotherapy recommended.', issuedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
    isCritical: false,
  },
];

// ─── Service Functions ────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDoctors = async (): Promise<Doctor[]> => {
  await delay(700);
  return [...MOCK_DOCTORS];
};

export const getAppointments = async (): Promise<Appointment[]> => {
  await delay(600);
  return [...mockAppointments];
};

export const getNotifications = async (): Promise<Notification[]> => {
  await delay(400);
  return [...mockNotifications];
};

export const getMedicalHistory = async (): Promise<MedicalRecord[]> => {
  await delay(600);
  return [...mockMedicalHistory];
};

export const getQueueStatus = async (): Promise<QueueStatus> => {
  await delay(400);
  // Find the active IN_QUEUE appointment
  const inQueue = mockAppointments.find(a => a.status === 'IN_QUEUE');
  const position = inQueue ? Math.floor(Math.random() * 4) + 1 : 0;
  return {
    position,
    estimatedWaitTime: position * 12,
    currentServing: 38,
    tokenNumber: inQueue?.tokenNumber ?? 0,
    totalWaiting: position + Math.floor(Math.random() * 3) + 1,
    doctorName: inQueue?.doctorName ?? '',
  };
};

type AppointmentPayload = {
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
  reasonForVisit: string;
  priority?: CasePriority;
};

export const bookAppointment = async (payload: AppointmentPayload): Promise<Appointment> => {
  await delay(1000);
  const doctor = MOCK_DOCTORS.find(d => d.id === payload.doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const priority: CasePriority = payload.type === 'EMERGENCY' ? 4 : payload.priority ?? 2;
  const tokenNumber = Math.floor(Math.random() * 50) + 1;

  const newAppt: Appointment = {
    id: Math.random().toString(36).slice(2, 9),
    patientId: 'mock-patient-id',
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date: payload.date,
    time: payload.time,
    type: payload.type,
    status: payload.type === 'EMERGENCY' ? 'IN_QUEUE' : 'CONFIRMED',
    priority,
    tokenNumber,
    reasonForVisit: payload.reasonForVisit,
    isCritical: payload.type === 'EMERGENCY',
  };

  mockAppointments.unshift(newAppt);
  return newAppt;
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  await delay(700);
  mockAppointments = mockAppointments.map(a =>
    a.id === appointmentId ? { ...a, status: 'CANCELLED' as const } : a
  );
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await delay(200);
  const n = mockNotifications.find(n => n.id === notificationId);
  if (n) n.isRead = true;
};
