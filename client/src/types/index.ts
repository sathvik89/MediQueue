export type Role = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
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

// Module 2 additions
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availability: string[];
  imageUrl?: string;
}

export type AppointmentStatus = 'scheduled' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string; // ISO date string
  time: string;
  status: AppointmentStatus;
}

export interface QueueStatus {
  position: number;
  estimatedWaitTime: number; // in minutes
  currentServing: number;
}
