// Factory Pattern
// Problem: the system needs to create different appointment objects without
// spreading appointment type checks across services and controllers.
// Solution: this file centralizes object creation and returns the right
// appointment class based on the requested appointment type.
import {
  Appointment,
  EmergencyAppointment,
  ScheduledAppointment,
  WalkInAppointment,
} from "../entities";
import { AppointmentType, CasePriority, TimeSlot } from "../types/system.types";

type AppointmentData = {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlot: TimeSlot;
  priority?: CasePriority;
};

export interface AppointmentFactory {
  create(data: AppointmentData): Appointment;
}

export class WalkInFactory implements AppointmentFactory {
  create(data: AppointmentData): Appointment {
    return new WalkInAppointment(
      data.id,
      data.patientId,
      data.doctorId,
      data.timeSlot,
      data.priority,
    );
  }
}

export class ScheduledFactory implements AppointmentFactory {
  create(data: AppointmentData): Appointment {
    return new ScheduledAppointment(
      data.id,
      data.patientId,
      data.doctorId,
      data.timeSlot,
      data.priority,
    );
  }
}

export class EmergencyFactory implements AppointmentFactory {
  create(data: AppointmentData): Appointment {
    return new EmergencyAppointment(
      data.id,
      data.patientId,
      data.doctorId,
      data.timeSlot,
      data.priority,
    );
  }
}

export class AppointmentFactoryProvider {
  static getFactory(type: AppointmentType): AppointmentFactory {
    switch (type) {
      case AppointmentType.WALK_IN:
        return new WalkInFactory();
      case AppointmentType.EMERGENCY:
        return new EmergencyFactory();
      case AppointmentType.SCHEDULED:
      default:
        return new ScheduledFactory();
    }
  }
}
