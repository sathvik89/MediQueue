import { IUser } from "./user_interface";

export interface IAdmin extends IUser {
  managedDoctorIds: string[];
  updateSystemSetting(key: string, value: string): Record<string, string>;
}
