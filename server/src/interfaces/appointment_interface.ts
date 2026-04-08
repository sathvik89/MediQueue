import {
  AppointmentStatus,
  AppointmentType,
  CasePriority,
  TimeSlot,
} from "../types/system.types";

export interface IAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  priority: CasePriority;
  timeSlot: TimeSlot;
  confirm(): void;
  cancel(): void;
  reschedule(timeSlot: TimeSlot): void;
}
