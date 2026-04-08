import { IUser } from "./user_interface";
import {
  AvailabilityStatus,
  DailySummary,
  FollowUpPlan,
  Prescription,
  QueueSnapshot,
  TimeSlot,
} from "../types/system.types";

export interface IDoctor extends IUser {
  specialization: string;
  availabilityStatus: AvailabilityStatus;
  availableSlots: TimeSlot[];
  blockedSlots: TimeSlot[];
  viewTodayQueue(snapshot: QueueSnapshot): QueueSnapshot;
  writePrescription(medicines: string[], notes: string): Prescription;
  recommendFollowUp(date: Date, notes: string): FollowUpPlan;
  viewDailySummary(summary: DailySummary): DailySummary;
}
