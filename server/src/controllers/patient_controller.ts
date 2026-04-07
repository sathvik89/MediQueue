import { Request, Response } from "express";
import { PatientService } from "../services/PatientService";
import { sendSuccess, sendError } from "../utils/ApiResponse";

// SRP: controller only handles HTTP req/res — delegates ALL logic to service
const patientService = new PatientService();

export const registerPatient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const patient = await patientService.registerPatient(req.body);
    sendSuccess(res, patient, "Patient registered", 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const getPatient = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const patient = await patientService.getPatientById(req.params.id);
    if (!patient) {
      sendError(res, "Patient not found", 404);
      return;
    }
    sendSuccess(res, patient);
  } catch (error) {
    sendError(res, error);
  }
};

export const getAllPatients = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const patients = await patientService.getAllPatients();
    sendSuccess(res, patients);
  } catch (error) {
    sendError(res, error);
  }
};
