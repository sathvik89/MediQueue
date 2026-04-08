import { IDoctor } from "../interfaces/doctor_interface";
import {
  AvailabilityStatus,
  DailySummary,
  FollowUpPlan,
  Prescription,
  QueueSnapshot,
  TimeSlot,
  UserRole,
} from "../types/system.types";
import { User } from "./user";

export class Doctor extends User implements IDoctor {
  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    public specialization: string,
    public availabilityStatus: AvailabilityStatus = AvailabilityStatus.AVAILABLE,
    public availableSlots: TimeSlot[] = [],
    public blockedSlots: TimeSlot[] = []
  ) {
    super(id, name, email, phone, UserRole.DOCTOR);
  }

  viewTodayQueue(snapshot: QueueSnapshot): QueueSnapshot {
    return snapshot;
  }

  writePrescription(medicines: string[], notes: string): Prescription {
    return {
      medicines,
      notes,
      issuedAt: new Date(),
    };
  }

  recommendFollowUp(date: Date, notes: string): FollowUpPlan {
    return {
      date,
      notes,
    };
  }

  viewDailySummary(summary: DailySummary): DailySummary {
    return summary;
  }

  setAvailability(slots: TimeSlot[]): void {
    this.availableSlots = slots;
    this.availabilityStatus = AvailabilityStatus.AVAILABLE;
  }

  blockTime(slot: TimeSlot): void {
    this.blockedSlots.push(slot);
    this.availabilityStatus = AvailabilityStatus.BUSY;
  }
}
