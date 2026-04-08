// ISP: Focused interface — only patient-specific fields
export interface IPatient {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  isEmergency: boolean;
  createdAt?: Date;
}
