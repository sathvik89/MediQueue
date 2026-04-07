// ISP: Focused interface — only doctor-specific fields
export interface IDoctor {
  _id?: string;
  name: string;
  email: string;
  specialization: string;
  isAvailable: boolean;
}
