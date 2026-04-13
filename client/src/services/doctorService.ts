import type { PatientConsultation } from '../types';

let mockQueue: PatientConsultation[] = [
  { id: 'c1', patientName: 'John Doe', timeSlot: '09:00 AM', status: 'waiting', issues: 'Mild fever and cough' },
  { id: 'c2', patientName: 'Jane Smith', timeSlot: '09:30 AM', status: 'waiting', issues: 'Routine checkup' },
  { id: 'c3', patientName: 'Robert Johnson', timeSlot: '10:00 AM', status: 'waiting', issues: 'Back pain' },
  { id: 'c4', patientName: 'Emily Davis', timeSlot: '10:30 AM', status: 'waiting' },
  { id: 'c5', patientName: 'Michael Wilson', timeSlot: '11:00 AM', status: 'waiting', issues: 'Allergy consultation' },
];

export const getDoctorQueue = async (): Promise<PatientConsultation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockQueue]), 600);
  });
};

export const callNextPatient = async (): Promise<PatientConsultation | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Find currently in-progress and complete it if any exists? No, we just grab the first waiting.
      // Wait, we mark it 'in-progress'
      const nextIndex = mockQueue.findIndex(p => p.status === 'waiting');
      if (nextIndex === -1) {
        resolve(null);
        return;
      }

      // If someone is already in progress, ideally we don't call next. But for mock simplicity:
      mockQueue = mockQueue.map(p => p.status === 'in-progress' ? { ...p, status: 'completed' } : p);
      
      mockQueue[nextIndex] = { ...mockQueue[nextIndex], status: 'in-progress' };
      resolve(mockQueue[nextIndex]);
    }, 800);
  });
};

export const completeConsultation = async (consultationId: string, notes: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockQueue = mockQueue.map(p => 
        p.id === consultationId ? { ...p, status: 'completed' } : p
      );
      resolve();
    }, 800);
  });
};

// Returns standard working hours
export const getAvailability = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '02:00 PM', '03:00 PM']), 400);
  });
};

export const updateAvailability = async (slots: string[]): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
};
