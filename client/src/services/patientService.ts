import type { Doctor, Appointment, QueueStatus } from '../types';

// Mock Data
const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', availability: ['09:00 AM', '10:00 AM', '02:00 PM'] },
  { id: 'd2', name: 'Dr. Michael Chen', specialty: 'Neurology', availability: ['11:00 AM', '01:00 PM', '04:00 PM'] },
  { id: 'd3', name: 'Dr. Emily Carter', specialty: 'General Practice', availability: ['08:00 AM', '09:30 AM', '03:00 PM'] },
];

let mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'mock-patient-id', // We'll ignore matching this strictly for the mock
    doctorId: 'd1',
    doctorName: 'Dr. Sarah Jenkins',
    specialty: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    status: 'scheduled'
  }
];

export const getDoctors = async (): Promise<Doctor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DOCTORS), 800);
  });
};

export const getAppointments = async (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockAppointments]), 600);
  });
};

export const bookAppointment = async (doctorId: string, date: string, time: string): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const doctor = MOCK_DOCTORS.find(d => d.id === doctorId);
      if (!doctor) return reject(new Error('Doctor not found'));
      
      const newAppt: Appointment = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: 'mock-patient-id',
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date,
        time,
        status: 'scheduled'
      };
      
      mockAppointments.unshift(newAppt);
      resolve(newAppt);
    }, 1000);
  });
};

export const cancelAppointment = async (appointmentId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAppointments = mockAppointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: 'cancelled' } : appt
      );
      resolve();
    }, 800);
  });
};

// Returns a simulated current queue status. We'll randomize it slightly if called repeatedly by a widget.
export const getQueueStatus = async (): Promise<QueueStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        position: Math.floor(Math.random() * 5) + 1, // Random position 1-5
        estimatedWaitTime: Math.floor(Math.random() * 30) + 10, // 10-40 mins
        currentServing: Math.floor(Math.random() * 10) + 100, // Token number currently being served
      });
    }, 500);
  });
};
