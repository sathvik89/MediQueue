import { Response } from "express";
import { UserModel } from "../models/user_model";
import { AppointmentModel } from "../models/appointment_model";
import { QueueModel } from "../models/queue_model";
import { MedicalRecordModel } from "../models/medical_record_model";
import {
  AppointmentStatus,
  QueueEntryStatus,
  AvailabilityStatus,
} from "../types/system.types";

export const getDoctorQueue = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queue = await QueueModel.findOne({
      doctorId,
      queueDate: { $gte: today },
    }).populate("entries.patientId", "name email").populate("entries.appointmentId", "reasonForVisit");

    if (!queue) {
      res.status(200).json([]);
      return;
    }

    // Map to frontend format
    const formattedQueue = queue.entries.map((entry: any) => ({
      id: entry.appointmentId._id.toString(),
      patientName: entry.patientId?.name || "Unknown",
      timeSlot: "N/A",
      status: entry.status === QueueEntryStatus.DONE ? "completed" : String(entry.status).toLowerCase().replace("_", "-"),
      issues: entry.appointmentId?.reasonForVisit || "General consultation",
      priority: entry.priority,
      tokenNumber: entry.tokenNumber,
      isCritical: entry.priority === 4,
    }));

    res.status(200).json(formattedQueue);
  } catch (error) {
    console.error("getDoctorQueue error:", error);
    res.status(500).json({ message: "Error fetching queue" });
  }
};

export const getQueueStrategy = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const user = await UserModel.findById(doctorId);
    res.status(200).json({ strategy: user?.preferredStrategy || "FIFO" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching strategy" });
  }
};

export const getDoctorStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const user = await UserModel.findById(doctorId).select("availabilityStatus");
    res.status(200).json({ status: user?.availabilityStatus || AvailabilityStatus.AVAILABLE });
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor status" });
  }
};

export const updateQueueStrategy = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const { strategy } = req.body;
    await UserModel.findByIdAndUpdate(doctorId, { preferredStrategy: strategy });
    res.status(200).json({ message: "Strategy updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating strategy" });
  }
};

export const updateDoctorStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const { status } = req.body;

    if (!Object.values(AvailabilityStatus).includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    await UserModel.findByIdAndUpdate(doctorId, { availabilityStatus: status });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

export const callNextPatient = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queue = await QueueModel.findOne({
      doctorId,
      queueDate: { $gte: today },
    });

    if (!queue || queue.entries.length === 0) {
      res.status(404).json({ message: "Queue is empty" });
      return;
    }

    // Mark current in-progress as done
    const currentActive = queue.entries.find(e => e.status === QueueEntryStatus.IN_PROGRESS || e.status === QueueEntryStatus.CALLED);
    if (currentActive) {
      currentActive.status = QueueEntryStatus.DONE;
      await AppointmentModel.findByIdAndUpdate(currentActive.appointmentId, { status: AppointmentStatus.COMPLETED });
    }

    // Find next waiting (FIFO for now, Strategy pattern could be applied here if we want)
    const nextPatient = queue.entries.find(e => e.status === QueueEntryStatus.WAITING);
    if (!nextPatient) {
      await queue.save();
      res.status(200).json(null);
      return;
    }

    nextPatient.status = QueueEntryStatus.IN_PROGRESS;
    queue.currentToken = nextPatient.tokenNumber;
    
    await AppointmentModel.findByIdAndUpdate(nextPatient.appointmentId, { status: AppointmentStatus.IN_CONSULTATION });
    await queue.save();

    res.status(200).json({
      id: nextPatient.appointmentId.toString(),
      patientName: "Patient", // Need to populate if name is needed
      status: "in-progress",
      tokenNumber: nextPatient.tokenNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calling next patient" });
  }
};

export const skipPatient = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const { id } = req.params;

    const queue = await QueueModel.findOne({
      doctorId,
      "entries.appointmentId": id,
    });

    if (!queue) {
      res.status(404).json({ message: "Queue entry not found" });
      return;
    }

    const entry = queue.entries.find((item) => item.appointmentId.toString() === id);
    if (!entry) {
      res.status(404).json({ message: "Queue entry not found" });
      return;
    }

    entry.status = QueueEntryStatus.WAITING;
    entry.checkedInAt = new Date();
    await AppointmentModel.findByIdAndUpdate(id, { status: AppointmentStatus.IN_QUEUE });
    await queue.save();

    res.status(200).json({ message: "Patient moved to the end of the queue" });
  } catch (error) {
    console.error("skipPatient error:", error);
    res.status(500).json({ message: "Error skipping patient" });
  }
};

export const flagCriticalCase = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const { id } = req.params;

    const appointment = await AppointmentModel.findOneAndUpdate(
      { _id: id, doctorId },
      { isCritical: true, priority: 4 },
      { new: true }
    );

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    const queue = await QueueModel.findOne({
      doctorId,
      "entries.appointmentId": id,
    });

    if (queue) {
      const entry = queue.entries.find((item) => item.appointmentId.toString() === id);
      if (entry) {
        entry.priority = 4;
        entry.status = QueueEntryStatus.WAITING;
      }
      await queue.save();
    }

    res.status(200).json({ message: "Patient flagged as critical" });
  } catch (error) {
    console.error("flagCriticalCase error:", error);
    res.status(500).json({ message: "Error flagging critical case" });
  }
};

export const completeConsultation = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // appointmentId
    const { diagnosis, medicines, notes, followUpDate, isCritical } = req.body;

    const appointment = await AppointmentModel.findByIdAndUpdate(id, {
      status: AppointmentStatus.COMPLETED,
      completedAt: new Date(),
    });

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Update queue entry if exists
    const queue = await QueueModel.findOne({ "entries.appointmentId": id });
    if (queue) {
      const entryIndex = queue.entries.findIndex(e => e.appointmentId.toString() === id);
      if (entryIndex !== -1) {
        queue.entries[entryIndex].status = QueueEntryStatus.DONE;
        await queue.save();
      }
    }

    // Create medical record
    await MedicalRecordModel.create({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentId: appointment._id,
      diagnosis,
      notes,
      prescription: {
        medicines: medicines || [],
        notes: notes || "",
        issuedAt: new Date(),
      },
      followUp: followUpDate ? {
        date: new Date(followUpDate),
        notes: "Follow-up recommended",
      } : undefined,
      isCritical: isCritical || false,
    });

    res.status(200).json({ message: "Consultation completed successfully" });
  } catch (error) {
    console.error("completeConsultation error:", error);
    res.status(500).json({ message: "Error completing consultation" });
  }
};

export const getWorkloadSummary = async (req: any, res: Response): Promise<void> => {
  try {
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await AppointmentModel.find({
      doctorId,
      createdAt: { $gte: today },
    });

    const completed = appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;
    const cancelled = appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length;
    const flagged = appointments.filter(a => a.isCritical).length;

    res.status(200).json({
      totalConsultations: appointments.length,
      completedAppointments: completed,
      cancelledAppointments: cancelled,
      flaggedCases: flagged,
      averageConsultationMinutes: 15,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching summary" });
  }
};
