import { IAdmin } from "../interfaces/admin_interface";
import { UserRole } from "../types/system.types";
import { User } from "./user";

export class Admin extends User implements IAdmin {
  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    public managedDoctorIds: string[] = [],
    private readonly systemSettings: Record<string, string> = {}
  ) {
    super(id, name, email, phone, UserRole.ADMIN);
  }

  addDoctor(doctorId: string): void {
    this.managedDoctorIds.push(doctorId);
  }

  updateSystemSetting(key: string, value: string): Record<string, string> {
    this.systemSettings[key] = value;
    return { ...this.systemSettings };
  }

  viewSettings(): Record<string, string> {
    return { ...this.systemSettings };
  }
}
