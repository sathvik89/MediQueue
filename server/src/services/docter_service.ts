import { DoctorModel } from "../models/Doctor";
import { IDoctor } from "../interfaces/IDoctor";

// SRP: only handles doctor CRUD
export class DoctorService {
  async registerDoctor(data: IDoctor): Promise<IDoctor> {
    const doctor = await DoctorModel.create(data);
    return doctor.toObject() as IDoctor;
  }

  async getDoctorById(id: string): Promise<IDoctor | null> {
    return DoctorModel.findById(id).lean() as Promise<IDoctor | null>;
  }

  async getAvailableDoctors(): Promise<IDoctor[]> {
    return DoctorModel.find({ isAvailable: true }).lean() as Promise<IDoctor[]>;
  }

  async setAvailability(
    id: string,
    isAvailable: boolean,
  ): Promise<IDoctor | null> {
    return DoctorModel.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true },
    ).lean() as Promise<IDoctor | null>;
  }
}
