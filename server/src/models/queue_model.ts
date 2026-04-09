import { InferSchemaType, Schema, Types, model } from "mongoose";
import { CasePriority, QueueEntryStatus } from "../types/system.types";

const casePriorityValues = Object.values(CasePriority).filter(
  (value): value is CasePriority => typeof value === "number"
);

const queueEntrySchema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tokenNumber: { type: Number, required: true },
    priority: {
      type: Number,
      enum: casePriorityValues,
      default: CasePriority.NORMAL,
      required: true,
    },
    checkedInAt: { type: Date, default: Date.now, required: true },
    status: {
      type: String,
      enum: Object.values(QueueEntryStatus),
      default: QueueEntryStatus.WAITING,
      required: true,
    },
    position: { type: Number },
  },
  { _id: false }
);

const queueSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    queueDate: { type: Date, required: true, index: true },
    currentToken: { type: Number, default: null },
    entries: { type: [queueEntrySchema], default: [] },
  },
  { timestamps: true }
);

queueSchema.index({ doctorId: 1, queueDate: 1 }, { unique: true });
queueSchema.index({ "entries.appointmentId": 1 });
queueSchema.index({ "entries.patientId": 1 });

export type QueueDocument = InferSchemaType<typeof queueSchema> & {
  _id: Types.ObjectId;
};

export const QueueModel = model("Queue", queueSchema);