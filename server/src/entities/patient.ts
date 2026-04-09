import { IPatient } from "../interfaces/patient_interface";
import { UserRole } from "../types/system.types";
import { User } from "./user";

export class Patient extends User implements IPatient {
  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    public medicalHistory: string[] = [],
    public currentTokenNumber: number | null = null,
    public appointmentHistory: string[] = []
  ) {
    super(id, name, email, phone, UserRole.PATIENT);
  }

  addMedicalRecord(record: string): void {
    this.medicalHistory.push(record);
  }

  setCurrentToken(tokenNumber: number | null): void {
    this.currentTokenNumber = tokenNumber;
  }

  addAppointmentHistory(appointmentId: string): void {
    this.appointmentHistory.push(appointmentId);
  }
}
