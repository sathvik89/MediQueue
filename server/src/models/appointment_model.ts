import { InferSchemaType, Schema, Types, model } from "mongoose";
import {
  AppointmentStatus,
  AppointmentType,
  CasePriority,
} from "../types/system.types";

const casePriorityValues = Object.values(CasePriority).filter(
  (value): value is CasePriority => typeof value === "number"
);

const timeSlotSchema = new Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { _id: false }
);

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(AppointmentType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
      required: true,
      index: true,
    },
    priority: {
      type: Number,
      enum: casePriorityValues,
      default: CasePriority.NORMAL,
      required: true,
    },
    timeSlot: { type: timeSlotSchema, required: true },
    tokenNumber: { type: Number },
    queuePosition: { type: Number },
    reasonForVisit: { type: String, trim: true },
    rescheduledFrom: { type: timeSlotSchema },
    cancelledAt: { type: Date },
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String, trim: true },
    adminOverrideReason: { type: String, trim: true },
    completedAt: { type: Date },
    isCritical: { type: Boolean, default: false },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, "timeSlot.startTime": 1 });
appointmentSchema.index({ patientId: 1, createdAt: -1 });
appointmentSchema.index({ doctorId: 1, status: 1, priority: -1 });

export type AppointmentDocument = InferSchemaType<typeof appointmentSchema> & {
  _id: Types.ObjectId;
};

export const AppointmentModel = model("Appointment", appointmentSchema);
