export enum UserRole {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  ADMIN = "ADMIN",
}

export enum AppointmentType {
  WALK_IN = "WALK_IN",
  SCHEDULED = "SCHEDULED",
  EMERGENCY = "EMERGENCY",
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_QUEUE = "IN_QUEUE",
  IN_CONSULTATION = "IN_CONSULTATION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RESCHEDULED = "RESCHEDULED",
}

export enum QueueEntryStatus {
  WAITING = "WAITING",
  CALLED = "CALLED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  MISSED = "MISSED",
}

export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  ON_BREAK = "ON_BREAK",
  OFF_DUTY = "OFF_DUTY",
}

export enum NotificationType {
  QUEUE_UPDATE = "QUEUE_UPDATE",
  APPOINTMENT_REMINDER = "APPOINTMENT_REMINDER",
  FOLLOW_UP = "FOLLOW_UP",
  GENERAL = "GENERAL",
}

export enum CasePriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  CRITICAL = 4,
}

export type TimeSlot = {
  startTime: Date;
  endTime: Date;
};

export type QueueEntry = {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  tokenNumber: number;
  priority: CasePriority;
  checkedInAt: Date;
  status: QueueEntryStatus;
};

export type QueueSnapshot = {
  doctorId: string;
  currentToken: number | null;
  totalWaiting: number;
  entries: QueueEntry[];
};

export type Prescription = {
  medicines: string[];
  notes: string;
  issuedAt: Date;
};

export type FollowUpPlan = {
  date: Date;
  notes: string;
};

export type NotificationMessage = {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  createdAt: Date;
};

export type DailySummary = {
  doctorId: string;
  totalConsultations: number;
  completedAppointments: number;
  cancelledAppointments: number;
  flaggedCases: number;
};
