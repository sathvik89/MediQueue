import { InferSchemaType, Schema, Types, model } from "mongoose";
import { NotificationType } from "../types/system.types";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.GENERAL,
      required: true,
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ appointmentId: 1 });

export type NotificationDocument = InferSchemaType<
  typeof notificationSchema
> & {
  _id: Types.ObjectId;
};

export const NotificationModel = model("Notification", notificationSchema);
