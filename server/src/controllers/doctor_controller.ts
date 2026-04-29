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
      patientId: entry.patientId?._id.toString(),
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

    const patientUser = await UserModel.findById(nextPatient.patientId).select("name");
    const patientName = patientUser ? patientUser.name : "Unknown";

    res.status(200).json({
      id: nextPatient.appointmentId.toString(),
      patientId: nextPatient.patientId.toString(),
      patientName,
      status: "in-progress",
      tokenNumber: nextPatient.tokenNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calling next patient" });
  }
};

export const skipPatient = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // appointmentId
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queue = await QueueModel.findOne({ doctorId, queueDate: { $gte: today } });
    if (!queue) {
      res.status(404).json({ message: "Queue not found" });
      return;
    }

    const entryIndex = queue.entries.findIndex(e => e.appointmentId.toString() === id);
    if (entryIndex === -1) {
      res.status(404).json({ message: "Patient not found in queue" });
      return;
    }

    // Move this patient to the end of the WAITING list by changing their checkedInAt time or simply moving them in the array.
    // For simplicity, let's update their token number to be the last one + 1, and set status to WAITING
    const entry = queue.entries[entryIndex];
    if (entry.status !== QueueEntryStatus.DONE) {
      const maxToken = Math.max(...queue.entries.map(e => e.tokenNumber));
      entry.tokenNumber = maxToken + 1;
      entry.status = QueueEntryStatus.WAITING;
      
      // Also update the appointment status if needed
      await AppointmentModel.findByIdAndUpdate(entry.appointmentId, { status: AppointmentStatus.IN_QUEUE });
      
      await queue.save();
    }

    res.status(200).json({ message: "Patient skipped successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error skipping patient" });
  }
};

export const flagCriticalCase = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // appointmentId
    const doctorId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queue = await QueueModel.findOne({ doctorId, queueDate: { $gte: today } });
    if (!queue) {
      res.status(404).json({ message: "Queue not found" });
      return;
    }

    const entryIndex = queue.entries.findIndex(e => e.appointmentId.toString() === id);
    if (entryIndex === -1) {
      res.status(404).json({ message: "Patient not found in queue" });
      return;
    }

    // Update priority to 4 (CRITICAL)
    queue.entries[entryIndex].priority = 4;
    await queue.save();

    await AppointmentModel.findByIdAndUpdate(id, { priority: 4 });

    res.status(200).json({ message: "Case flagged as critical" });
  } catch (error) {
    res.status(500).json({ message: "Error flagging case" });
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

export const getPatientHistory = async (req: any, res: Response): Promise<void> => {
  try {
    const { patientId } = req.params;
    const history = await MedicalRecordModel.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    const formatted = history.map(h => ({
      id: h._id,
      date: h.createdAt.toISOString().split('T')[0],
      doctorName: (h.doctorId as any).name,
      specialty: (h.doctorId as any).specialization,
      diagnosis: h.diagnosis,
      prescription: h.prescription?.medicines || [],
      notes: h.notes,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient history" });
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
