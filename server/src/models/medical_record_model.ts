import { InferSchemaType, Schema, Types, model } from "mongoose";

const prescriptionSchema = new Schema(
  {
    medicines: { type: [String], default: [] },
    notes: { type: String, trim: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const followUpSchema = new Schema(
  {
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
);

const medicalRecordSchema = new Schema(
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
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },
    diagnosis: { type: String, trim: true },
    notes: { type: String, trim: true },
    prescription: { type: prescriptionSchema },
    followUp: { type: followUpSchema },
    isCritical: { type: Boolean, default: false },
    criticalNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1, createdAt: -1 });
medicalRecordSchema.index({ isCritical: 1, createdAt: -1 });

export type MedicalRecordDocument = InferSchemaType<
  typeof medicalRecordSchema
> & {
  _id: Types.ObjectId;
};

export const MedicalRecordModel = model("MedicalRecord", medicalRecordSchema);
