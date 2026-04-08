import mongoose, { Schema, Document } from "mongoose";
import {
  IAppointment,
  AppointmentType,
  AppointmentStatus,
} from "../interfaces/IAppointment";

export interface AppointmentDocument extends IAppointment, Document {}

// Abstraction: base class defines common shape — subclasses in Factory add type-specific logic
export abstract class BaseAppointment implements IAppointment {
  patientId: string;
  doctorId: string;
  abstract type: AppointmentType; // each subclass must define its own type
  status: AppointmentStatus = "pending";
  scheduledAt?: Date;

  constructor(patientId: string, doctorId: string, scheduledAt?: Date) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.scheduledAt = scheduledAt;
  }

  // Polymorphism: each subclass can override this to describe itself
  describe(): string {
    return `${this.type} appointment for patient ${this.patientId}`;
  }
}

const AppointmentSchema = new Schema<AppointmentDocument>(
  {
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    type: { type: String, enum: ["walkin", "scheduled"], required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    scheduledAt: { type: Date },
  },
  { timestamps: true },
);

export const AppointmentModel = mongoose.model<AppointmentDocument>(
  "Appointment",
  AppointmentSchema,
);
