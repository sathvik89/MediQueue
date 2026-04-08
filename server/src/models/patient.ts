import mongoose, { Schema, Document } from "mongoose";
import { IPatient } from "../interfaces/IPatient";

// Encapsulation: internal document shape hidden behind IPatient interface
export interface PatientDocument extends IPatient, Document {}

const PatientSchema = new Schema<PatientDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    isEmergency: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const PatientModel = mongoose.model<PatientDocument>(
  "Patient",
  PatientSchema,
);
