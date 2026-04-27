import { api } from './api';
import type { Doctor, PatientAdminView } from '../types';

export interface SystemStats {
  totalPatientsToday: number;
  activeDoctors: number;
  averageWaitTime: number; // in minutes
  totalAppointments: number;
}

export interface SchedulingConflict {
  id: string;
  doctorName: string;
  timeSlot: string;
  issue: string; // e.g., "Double booked"
}

export const getSystemStats = async (): Promise<SystemStats> => {
  const response = await api.get<SystemStats>('/admin/stats');
  return response.data;
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>('/admin/doctors');
  return response.data;
};

export const addDoctor = async (name: string, specialty: string): Promise<Doctor> => {
  const response = await api.post<Doctor>('/admin/doctors', { name, specialty });
  return response.data;
};

export const removeDoctor = async (doctorId: string): Promise<void> => {
  await api.delete(`/admin/doctors/${doctorId}`);
};

export const toggleDoctorStatus = async (doctorId: string): Promise<void> => {
  await api.patch(`/admin/doctors/${doctorId}/toggle-status`);
};

export const getAllPatients = async (query: string = '', sortBy: string = 'newest'): Promise<PatientAdminView[]> => {
  const response = await api.get<PatientAdminView[]>('/admin/patients', { params: { query, sortBy } });
  return response.data;
};

export const getConflicts = async (): Promise<SchedulingConflict[]> => {
  const response = await api.get<SchedulingConflict[]>('/admin/conflicts');
  return response.data;
};

export const resolveConflict = async (conflictId: string): Promise<void> => {
  await api.post(`/admin/conflicts/${conflictId}/resolve`);
};
