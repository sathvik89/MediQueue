import type { Doctor } from '../types';

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

// Initial Mock Data
let mockAdminDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', availability: ['09:00 AM', '10:00 AM', '02:00 PM'], availabilityStatus: 'AVAILABLE' },
  { id: 'd2', name: 'Dr. Michael Chen', specialty: 'Neurology', availability: ['11:00 AM', '01:00 PM', '04:00 PM'], availabilityStatus: 'AVAILABLE' },
  { id: 'd3', name: 'Dr. Emily Carter', specialty: 'General Practice', availability: ['08:00 AM', '09:30 AM', '03:00 PM'], availabilityStatus: 'AVAILABLE' },
];

let mockConflicts: SchedulingConflict[] = [
  { id: 'conf1', doctorName: 'Dr. Emily Carter', timeSlot: '09:30 AM', issue: 'Double Booked (2 Patients)' }
];

export const getSystemStats = async (): Promise<SystemStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalPatientsToday: 142,
        activeDoctors: mockAdminDoctors.length,
        averageWaitTime: 18,
        totalAppointments: 210
      });
    }, 600);
  });
};

export const getAllDoctors = async (): Promise<Doctor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockAdminDoctors]), 500);
  });
};

export const addDoctor = async (name: string, specialty: string): Promise<Doctor> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDoctor: Doctor = {
        id: 'd' + Math.random().toString(36).substr(2, 5),
        name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
        specialty,
        availability: ['09:00 AM', '10:00 AM', '11:00 AM'], // default slots
        availabilityStatus: 'AVAILABLE'
      };
      mockAdminDoctors.push(newDoctor);
      resolve(newDoctor);
    }, 800);
  });
};

export const removeDoctor = async (doctorId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAdminDoctors = mockAdminDoctors.filter(d => d.id !== doctorId);
      resolve();
    }, 800);
  });
};

export const getConflicts = async (): Promise<SchedulingConflict[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockConflicts]), 400);
  });
};

export const resolveConflict = async (conflictId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockConflicts = mockConflicts.filter(c => c.id !== conflictId);
      resolve();
    }, 600);
  });
};
