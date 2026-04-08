export type AppointmentType = "walkin" | "scheduled";
export type AppointmentStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface IAppointment {
  _id?: string;
  patientId: string;
  doctorId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt?: Date;
  createdAt?: Date;
}
