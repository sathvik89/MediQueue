import { AppointmentType, CasePriority, TimeSlot } from "../types/system.types";
import { Appointment } from "./appointment";

export class EmergencyAppointment extends Appointment {
  constructor(
    id: string,
    patientId: string,
    doctorId: string,
    timeSlot: TimeSlot,
    priority: CasePriority = CasePriority.CRITICAL
  ) {
    super(id, patientId, doctorId, AppointmentType.EMERGENCY, priority, timeSlot);
  }
}
