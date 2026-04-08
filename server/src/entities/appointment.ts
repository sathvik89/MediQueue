import { IAppointment } from "../interfaces/appointment_interface";
import {
  AppointmentStatus,
  AppointmentType,
  CasePriority,
  TimeSlot,
} from "../types/system.types";

export abstract class Appointment implements IAppointment {
  public status: AppointmentStatus = AppointmentStatus.PENDING;

  constructor(
    public id: string,
    public patientId: string,
    public doctorId: string,
    public type: AppointmentType,
    public priority: CasePriority,
    public timeSlot: TimeSlot
  ) {}

  confirm(): void {
    this.status = AppointmentStatus.CONFIRMED;
  }

  cancel(): void {
    this.status = AppointmentStatus.CANCELLED;
  }

  reschedule(timeSlot: TimeSlot): void {
    this.timeSlot = timeSlot;
    this.status = AppointmentStatus.RESCHEDULED;
  }
}
