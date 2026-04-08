import { IUser } from "../interfaces/user_interface";
import { UserRole } from "../types/system.types";

export abstract class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public role: UserRole
  ) {}
}
