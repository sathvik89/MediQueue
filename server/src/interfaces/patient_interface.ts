import { IUser } from "./user_interface";

export interface IPatient extends IUser {
  medicalHistory: string[];
  currentTokenNumber: number | null;
  appointmentHistory: string[];
}
