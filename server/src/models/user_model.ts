import { InferSchemaType, Schema, Types, model } from "mongoose";
import { AvailabilityStatus, UserRole } from "../types/system.types";

const timeSlotSchema = new Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  { _id: false }
);

const blockedSlotSchema = new Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    reason: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    passwordHash: { type: String, select: false },
    isActive: { type: Boolean, default: true },
    medicalHistory: { type: [String], default: [] },
    currentTokenNumber: { type: Number, default: null },
    appointmentHistory: {
      type: [Schema.Types.ObjectId],
      ref: "Appointment",
      default: [],
    },
    specialization: { type: String, trim: true },
    availabilityStatus: {
      type: String,
      enum: Object.values(AvailabilityStatus),
      default: AvailabilityStatus.AVAILABLE,
    },
    availableSlots: { type: [timeSlotSchema], default: [] },
    blockedSlots: { type: [blockedSlotSchema], default: [] },
    managedDoctorIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    deactivatedAt: { type: Date },
    deactivatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ specialization: 1, availabilityStatus: 1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export const UserModel = model("User", userSchema);
