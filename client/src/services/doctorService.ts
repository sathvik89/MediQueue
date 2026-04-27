import { api } from './api';
import type { PatientConsultation, WorkloadSummary, QueueStrategy, AvailabilityStatus } from '../types';

export const getDoctorQueue = async (): Promise<PatientConsultation[]> => {
  const response = await api.get<PatientConsultation[]>('/doctor/queue');
  return response.data;
};

export const callNextPatient = async (): Promise<PatientConsultation | null> => {
  const response = await api.post<PatientConsultation | null>('/doctor/call-next');
  return response.data;
};

export const completeConsultation = async (id: string, data?: any): Promise<void> => {
  await api.post(`/doctor/complete/${id}`, data);
};

export const skipPatient = async (id: string): Promise<void> => {
  await api.post(`/doctor/skip/${id}`);
};

export const flagCriticalCase = async (id: string): Promise<void> => {
  await api.post(`/doctor/flag/${id}`);
};

export const setQueueStrategy = async (strategy: QueueStrategy): Promise<void> => {
  await api.patch('/doctor/strategy', { strategy });
};

export const getQueueStrategy = async (): Promise<QueueStrategy> => {
  const response = await api.get<{ strategy: QueueStrategy }>('/doctor/strategy');
  return response.data.strategy || 'FIFO'; 
};

export const getDoctorStatus = async (): Promise<AvailabilityStatus> => {
  const response = await api.get<{ status: AvailabilityStatus }>('/doctor/status');
  return response.data.status || 'AVAILABLE';
};

export const setDoctorStatus = async (status: AvailabilityStatus): Promise<void> => {
  await api.patch('/doctor/status', { status });
};

export const getWorkloadSummary = async (): Promise<WorkloadSummary> => {
  const response = await api.get<WorkloadSummary>('/doctor/summary');
  return response.data;
};

export const getAvailability = async (): Promise<string[]> => {
  // Mocked for now as per original
  return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
};

export const updateAvailability = async (_slots: string[]): Promise<void> => {
  // Logic to update slots if backend supports it
};
