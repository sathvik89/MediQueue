import { api } from './api';
import type {
  Doctor, Appointment, QueueStatus, Notification, MedicalRecord, AppointmentType, CasePriority
} from '../types';

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>('/patient/doctors');
  return response.data;
};

export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>('/patient/appointments');
  return response.data;
};

export const getNotifications = async (): Promise<Notification[]> => {
  // Mock notifications for now as notification system might not be fully in DB
  return []; 
};

export const getMedicalHistory = async (): Promise<MedicalRecord[]> => {
  // Fetch from DB if available
  return [];
};

export const getQueueStatus = async (): Promise<QueueStatus | null> => {
  const response = await api.get<QueueStatus | null>('/patient/queue-status');
  return response.data;
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
  const response = await api.post<Appointment>('/patient/appointments', payload);
  return response.data;
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  await api.delete(`/patient/appointments/${appointmentId}`);
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  // Logic if needed
};
