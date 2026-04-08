import { Request, Response } from "express";
import { AppointmentService } from "../services/AppointmentService";
import { sendSuccess, sendError } from "../utils/ApiResponse";

const appointmentService = new AppointmentService();

export const createAppointment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { type, patientId, doctorId, scheduledAt } = req.body;
    const appointment = await appointmentService.createAppointment(
      type,
      patientId,
      doctorId,
      scheduledAt ? new Date(scheduledAt) : undefined,
    );
    sendSuccess(res, appointment, "Appointment created", 201);
  } catch (error) {
    sendError(res, error);
  }
};

export const getPatientAppointments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const appointments = await appointmentService.getAppointmentsByPatient(
      req.params.patientId,
    );
    sendSuccess(res, appointments);
  } catch (error) {
    sendError(res, error);
  }
};

export const cancelAppointment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cancelled = await appointmentService.cancelAppointment(req.params.id);
    if (!cancelled) {
      sendError(res, "Appointment not found", 404);
      return;
    }
    sendSuccess(res, cancelled, "Appointment cancelled");
  } catch (error) {
    sendError(res, error);
  }
};
