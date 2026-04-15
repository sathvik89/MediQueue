import type { PatientConsultation, WorkloadSummary, QueueStrategy, AvailabilityStatus, CasePriority } from '../types';

// ─── Mock Doctor Queue ────────────────────────────────────────────
let mockQueue: PatientConsultation[] = [
  { id: 'c1', patientName: 'Arjun Mehta', timeSlot: '09:00', status: 'in-progress', issues: 'Chest pain and palpitations', priority: 3, tokenNumber: 38, isCritical: false },
  { id: 'c2', patientName: 'Priya Sharma', timeSlot: '09:30', status: 'waiting', issues: 'Routine annual checkup', priority: 2, tokenNumber: 39, isCritical: false },
  { id: 'c3', patientName: 'Rahul Nair', timeSlot: '10:00', status: 'waiting', issues: 'Shortness of breath', priority: 3, tokenNumber: 40, isCritical: false },
  { id: 'c4', patientName: 'Kavita Reddy', timeSlot: '10:30', status: 'waiting', issues: 'Follow-up for hypertension', priority: 2, tokenNumber: 41, isCritical: false },
  { id: 'c5', patientName: 'Vikram Singh', timeSlot: '11:00', status: 'waiting', issues: 'Irregular heartbeat (Emergency)', priority: 4, tokenNumber: 42, isCritical: true },
  { id: 'c6', patientName: 'Sunita Joshi', timeSlot: '11:30', status: 'waiting', issues: 'Fatigue and dizziness', priority: 2, tokenNumber: 43, isCritical: false },
  { id: 'c7', patientName: 'Deepak Kumar', timeSlot: '14:00', status: 'completed', issues: 'Blood pressure monitoring', priority: 2, tokenNumber: 35, isCritical: false },
  { id: 'c8', patientName: 'Anjali Iyer', timeSlot: '14:30', status: 'completed', issues: 'General wellness check', priority: 1, tokenNumber: 36, isCritical: false },
];

let currentStrategy: QueueStrategy = 'FIFO';
let doctorStatus: AvailabilityStatus = 'AVAILABLE';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ─── Strategy Pattern simulation (sorts in-memory like backend) ──
const applySortStrategy = (entries: PatientConsultation[]): PatientConsultation[] => {
  const waiting = entries.filter(e => e.status === 'waiting');
  const others = entries.filter(e => e.status !== 'waiting');

  let sorted: PatientConsultation[];
  if (currentStrategy === 'PRIORITY') {
    sorted = [...waiting].sort((a, b) => (b.priority ?? 2) - (a.priority ?? 2));
  } else if (currentStrategy === 'ROUND_ROBIN') {
    sorted = [...waiting].sort((a, b) => (a.tokenNumber ?? 0) - (b.tokenNumber ?? 0));
  } else {
    // FIFO — sort by tokenNumber ascending
    sorted = [...waiting].sort((a, b) => (a.tokenNumber ?? 0) - (b.tokenNumber ?? 0));
  }

  return [...others.filter(e => e.status === 'in-progress'), ...sorted, ...others.filter(e => e.status === 'completed')];
};

// ─── Service Functions ────────────────────────────────────────────

export const getDoctorQueue = async (): Promise<PatientConsultation[]> => {
  await delay(500);
  return applySortStrategy([...mockQueue]);
};

export const callNextPatient = async (): Promise<PatientConsultation | null> => {
  await delay(700);
  // Mark current in-progress as done
  mockQueue = mockQueue.map(p => p.status === 'in-progress' ? { ...p, status: 'completed' as const } : p);
  const sorted = applySortStrategy(mockQueue);
  const nextIndex = mockQueue.findIndex(p => p.id === sorted.find(s => s.status === 'waiting')?.id);
  if (nextIndex === -1) return null;
  mockQueue[nextIndex] = { ...mockQueue[nextIndex], status: 'in-progress' as const };
  return mockQueue[nextIndex];
};

export const completeConsultation = async (id: string): Promise<void> => {
  await delay(600);
  mockQueue = mockQueue.map(p => p.id === id ? { ...p, status: 'completed' as const } : p);
};

export const skipPatient = async (id: string): Promise<void> => {
  await delay(500);
  // Move to end of waiting list with 'missed' effectively by setting as back of queue
  const patient = mockQueue.find(p => p.id === id);
  if (!patient) return;
  mockQueue = mockQueue.filter(p => p.id !== id);
  mockQueue.push({ ...patient, status: 'waiting' });
};

export const flagCriticalCase = async (id: string): Promise<void> => {
  await delay(400);
  mockQueue = mockQueue.map(p => p.id === id ? { ...p, isCritical: true, priority: 4 as CasePriority } : p);
};

export const setQueueStrategy = async (strategy: QueueStrategy): Promise<void> => {
  await delay(300);
  currentStrategy = strategy;
};

export const getQueueStrategy = async (): Promise<QueueStrategy> => {
  await delay(100);
  return currentStrategy;
};

export const getDoctorStatus = async (): Promise<AvailabilityStatus> => {
  await delay(200);
  return doctorStatus;
};

export const setDoctorStatus = async (status: AvailabilityStatus): Promise<void> => {
  await delay(400);
  doctorStatus = status;
};

export const getWorkloadSummary = async (): Promise<WorkloadSummary> => {
  await delay(600);
  const completed = mockQueue.filter(p => p.status === 'completed').length;
  const critical = mockQueue.filter(p => p.isCritical).length;
  return {
    totalConsultations: mockQueue.length,
    completedAppointments: completed,
    cancelledAppointments: 1,
    flaggedCases: critical,
    averageConsultationMinutes: 14,
  };
};

export const getAvailability = async (): Promise<string[]> => {
  await delay(300);
  return ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
};

export const updateAvailability = async (_slots: string[]): Promise<void> => {
  await delay(500);
};
