import { AppointmentType, CasePriority, TimeSlot } from "../types/system.types";
import { Appointment } from "./appointment";

export class ScheduledAppointment extends Appointment {
  constructor(
    id: string,
    patientId: string,
    doctorId: string,
    timeSlot: TimeSlot,
    priority: CasePriority = CasePriority.NORMAL
  ) {
    super(id, patientId, doctorId, AppointmentType.SCHEDULED, priority, timeSlot);
  }
}
