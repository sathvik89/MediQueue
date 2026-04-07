import { PatientModel } from "../models/Patient";
import { IPatient } from "../interfaces/IPatient";

// SRP: only handles patient CRUD
export class PatientService {
  async registerPatient(data: IPatient): Promise<IPatient> {
    const patient = await PatientModel.create(data);
    return patient.toObject() as IPatient;
  }

  async getPatientById(id: string): Promise<IPatient | null> {
    return PatientModel.findById(id).lean() as Promise<IPatient | null>;
  }

  async getAllPatients(): Promise<IPatient[]> {
    return PatientModel.find().lean() as Promise<IPatient[]>;
  }
}
