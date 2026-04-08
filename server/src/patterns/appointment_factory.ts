import { BaseAppointment } from "../../models/Appointment";
import { AppointmentType } from "../../interfaces/IAppointment";

// Concrete subclasses — Inheritance from BaseAppointment
// Polymorphism: each overrides describe() differently

export class WalkInAppointment extends BaseAppointment {
  type: AppointmentType = "walkin";

  describe(): string {
    return `Walk-in appointment for patient ${this.patientId} — no prior booking`;
  }
}

export class ScheduledAppointment extends BaseAppointment {
  type: AppointmentType = "scheduled";

  describe(): string {
    return `Scheduled appointment for patient ${this.patientId} at ${this.scheduledAt?.toISOString()}`;
  }
}

// FACTORY PATTERN
// Single place to create appointments — callers don't need to know which class to instantiate.
// OCP: add a new type (e.g. "teleconsult") by adding a case here — no other file changes.
export class AppointmentFactory {
  static create(
    type: AppointmentType,
    patientId: string,
    doctorId: string,
    scheduledAt?: Date,
  ): BaseAppointment {
    switch (type) {
      case "walkin":
        return new WalkInAppointment(patientId, doctorId);
      case "scheduled":
        return new ScheduledAppointment(patientId, doctorId, scheduledAt);
      default:
        throw new Error(`Unknown appointment type: ${type}`);
    }
  }
}
