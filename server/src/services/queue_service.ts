import { AppointmentModel } from "../models/Appointment";
import { IAppointment } from "../interfaces/IAppointment";
import {
  QueueContext,
  FIFOStrategy,
  PriorityStrategy,
} from "../patterns/strategy/QueueStrategy";
import {
  QueueSubject,
  PatientNotifier,
  DoctorDashboard,
} from "../patterns/observer/QueueSubject";

// SRP: QueueService only manages queue logic — nothing else
// DIP: depends on interfaces and pattern abstractions, not raw models

export class QueueService {
  // Observer: one shared subject for queue events
  private queueSubject: QueueSubject;

  // Strategy: default to FIFO, can be switched at runtime
  private queueContext: QueueContext;

  constructor() {
    this.queueSubject = new QueueSubject();
    this.queueContext = new QueueContext(new FIFOStrategy());

    // Register observers — adding more observers doesn't require changing this class (OCP)
    this.queueSubject.subscribe(new PatientNotifier());
    this.queueSubject.subscribe(new DoctorDashboard());
  }

  // Switch queue ordering strategy at runtime
  enablePriorityMode(): void {
    this.queueContext.setStrategy(new PriorityStrategy());
  }

  enableFIFOMode(): void {
    this.queueContext.setStrategy(new FIFOStrategy());
  }

  // Get the current queue for a doctor, sorted by active strategy
  async getQueueForDoctor(doctorId: string): Promise<IAppointment[]> {
    const appointments = await AppointmentModel.find({
      doctorId,
      status: "pending",
    }).lean();

    const sorted = this.queueContext.executeSort(
      appointments as IAppointment[],
    );

    // Notify all observers that queue was fetched/updated
    this.queueSubject.notify("QUEUE_UPDATED", {
      doctorId,
      count: sorted.length,
    });

    return sorted;
  }

  // Move an appointment to in-progress
  async callNextPatient(doctorId: string): Promise<IAppointment | null> {
    const queue = await this.getQueueForDoctor(doctorId);
    if (queue.length === 0) return null;

    const next = queue[0];
    const updated = await AppointmentModel.findByIdAndUpdate(
      next._id,
      { status: "in-progress" },
      { new: true },
    ).lean();

    this.queueSubject.notify("PATIENT_CALLED", {
      patientId: next.patientId,
      doctorId,
    });

    return updated as IAppointment;
  }

  // Mark appointment as completed
  async completeAppointment(
    appointmentId: string,
  ): Promise<IAppointment | null> {
    const completed = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "completed" },
      { new: true },
    ).lean();

    this.queueSubject.notify("APPOINTMENT_COMPLETED", { appointmentId });

    return completed as IAppointment;
  }
}
