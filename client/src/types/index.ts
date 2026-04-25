// Roles
export type Role = 'patient' | 'doctor' | 'admin';

// Auth
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Present when role is 'doctor' */
  specialization?: string;
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  authState: AuthState;
  login: (user: User) => void;
  logout: () => void;
}

// ─── Enums mirroring backend system.types ───────────────────────
export type AppointmentType = 'WALK_IN' | 'SCHEDULED' | 'EMERGENCY';
export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_QUEUE'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RESCHEDULED';
export type QueueEntryStatus = 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'DONE' | 'MISSED';
export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'ON_BREAK' | 'OFF_DUTY';
export type NotificationType = 'QUEUE_UPDATE' | 'APPOINTMENT_REMINDER' | 'FOLLOW_UP' | 'GENERAL';
export type CasePriority = 1 | 2 | 3 | 4; // 1=LOW, 2=NORMAL, 3=HIGH, 4=CRITICAL
export type QueueStrategy = 'FIFO' | 'PRIORITY' | 'ROUND_ROBIN';

// ─── Domain Types ────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
  availabilityStatus: AvailabilityStatus;
  imageUrl?: string;
}

export interface PatientAdminView {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalAppointments: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  priority: CasePriority;
  tokenNumber?: number;
  reasonForVisit?: string;
  isCritical?: boolean;
}

export interface QueueStatus {
  position: number;
  estimatedWaitTime: number;
  currentServing: number;
  tokenNumber: number;
  totalWaiting: number;
  doctorName: string;
}

export interface QueueEntry {
  id: string;
  tokenNumber: number;
  patientName: string;
  priority: CasePriority;
  status: QueueEntryStatus;
  checkedInAt: string;
  reasonForVisit?: string;
  isCritical?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  appointmentId?: string;
}

export interface Prescription {
  medicines: string[];
  notes: string;
  issuedAt: string;
}

export interface MedicalRecord {
  id: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  notes: string;
  prescription?: Prescription;
  followUpDate?: string;
  isCritical: boolean;
}

export interface WorkloadSummary {
  totalConsultations: number;
  completedAppointments: number;
  cancelledAppointments: number;
  flaggedCases: number;
  averageConsultationMinutes: number;
}

// ─── Legacy (used by existing components, kept for compat) ───────
export interface PatientConsultation {
  id: string;
  patientName: string;
  timeSlot: string;
  status: 'waiting' | 'in-progress' | 'completed';
  issues?: string;
  priority?: CasePriority;
  tokenNumber?: number;
  isCritical?: boolean;
}
