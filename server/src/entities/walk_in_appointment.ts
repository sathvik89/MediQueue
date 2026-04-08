import { AppointmentType, CasePriority, TimeSlot } from "../types/system.types";
import { Appointment } from "./appointment";

export class WalkInAppointment extends Appointment {
  constructor(
    id: string,
    patientId: string,
    doctorId: string,
    timeSlot: TimeSlot,
    priority: CasePriority = CasePriority.NORMAL
  ) {
    super(id, patientId, doctorId, AppointmentType.WALK_IN, priority, timeSlot);
  }
}
