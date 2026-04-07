import mongoose, { Schema, Document } from "mongoose";
import { IDoctor } from "../interfaces/IDoctor";

export interface DoctorDocument extends IDoctor, Document {}

const DoctorSchema = new Schema<DoctorDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    specialization: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const DoctorModel = mongoose.model<DoctorDocument>(
  "Doctor",
  DoctorSchema,
);
