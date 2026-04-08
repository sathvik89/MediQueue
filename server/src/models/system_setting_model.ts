import { InferSchemaType, Schema, Types, model } from "mongoose";

const queueStrategies = ["FIFO", "PRIORITY", "ROUND_ROBIN"] as const;

const workingHoursSchema = new Schema(
  {
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const systemSettingSchema = new Schema(
  {
    consultationDurationMinutes: {
      type: Number,
      required: true,
      min: 1,
      default: 15,
    },
    workingHours: {
      type: workingHoursSchema,
      required: true,
      default: { startTime: "09:00", endTime: "18:00" },
    },
    workingDays: {
      type: [String],
      default: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    },
    allowWalkInAppointments: { type: Boolean, default: true },
    allowEmergencyAppointments: { type: Boolean, default: true },
    maxAppointmentsPerSlot: { type: Number, default: 1, min: 1 },
    defaultQueueStrategy: {
      type: String,
      enum: queueStrategies,
      default: "FIFO",
      required: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

systemSettingSchema.index(
  { isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

export type SystemSettingDocument = InferSchemaType<
  typeof systemSettingSchema
> & {
  _id: Types.ObjectId;
};

export const SystemSettingModel = model("SystemSetting", systemSettingSchema);