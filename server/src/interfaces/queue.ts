import { IAppointment } from "./appointment.js";

// ISP: Queue-specific contract
export interface IQueue {
  doctorId: string;
  appointments: IAppointment[];
  currentPosition: number;
}

// Observer Pattern: every listener must implement this contract
export interface IObserver {
  update(event: string, data: unknown): void;
}

// Strategy Pattern: every queue ordering algorithm must implement this
export interface IQueueStrategy {
  sort(appointments: IAppointment[]): IAppointment[];
}

// Notification contract — ISP keeps it small
export interface INotification {
  patientId: string;
  message: string;
  sentAt: Date;
}
