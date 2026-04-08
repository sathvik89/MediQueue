import { UserRole } from "../types/system.types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}
