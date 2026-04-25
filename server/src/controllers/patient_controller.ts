import { Response } from "express";
import { UserModel } from "../models/user_model";
import { AppointmentModel } from "../models/appointment_model";
import { NotificationModel } from "../models/notification_model";
import { MedicalRecordModel } from "../models/medical_record_model";
import { QueueModel } from "../models/queue_model";
import {
  UserRole,
  AppointmentType,
  AppointmentStatus,
  QueueEntryStatus,
  CasePriority,
} from "../types/system.types";

export const getDoctors = async (req: any, res: Response): Promise<void> => {
  try {
    const doctors = await UserModel.find({ role: UserRole.DOCTOR, isActive: true })
      .select("name specialization availabilityStatus imageUrl bio");
    
    // Map to frontend Doctor type
    const formattedDoctors = doctors.map(doc => ({
      id: doc._id,
      name: doc.name,
      specialty: doc.specialization || "General Medicine",
      availability: ["09:00", "10:00", "11:00", "14:00", "15:00"], // Mock for now or fetch from schedule
      availabilityStatus: doc.availabilityStatus || "AVAILABLE",
      imageUrl: doc.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random`,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

export const bookAppointment = async (req: any, res: Response): Promise<void> => {
  try {
    const patientId = req.user._id;
    const { doctorId, date, time, type, reasonForVisit, priority } = req.body;

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 mins

    const newAppointment = await AppointmentModel.create({
      patientId,
      doctorId,
      type: type || AppointmentType.SCHEDULED,
      reasonForVisit,
      priority: priority || CasePriority.NORMAL,
      timeSlot: { startTime, endTime },
      status: AppointmentStatus.CONFIRMED,
    });

    // If it's for today, maybe add to queue automatically? 
    // For now let's just create the appointment.
    
    // Logic to update queue if it's for today
    const today = new Date();
    today.setHours(0,0,0,0);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0,0,0,0);

    if (appointmentDate.getTime() === today.getTime()) {
      let queue = await QueueModel.findOne({ doctorId, queueDate: { $gte: today } });
      if (!queue) {
        queue = await QueueModel.create({ doctorId, queueDate: today, entries: [] });
      }
      
      const tokenNumber = queue.entries.length + 1;
      queue.entries.push({
        appointmentId: newAppointment._id,
        patientId,
        doctorId,
        tokenNumber,
        priority: newAppointment.priority,
        status: QueueEntryStatus.WAITING,
        checkedInAt: new Date(),
      });
      await queue.save();
      
      newAppointment.tokenNumber = tokenNumber;
      newAppointment.status = AppointmentStatus.IN_QUEUE;
      await newAppointment.save();
    }

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("bookAppointment error:", error);
    res.status(500).json({ message: "Error booking appointment" });
  }
};

export const getMyAppointments = async (req: any, res: Response): Promise<void> => {
  try {
    const patientId = req.user._id;
    const appointments = await AppointmentModel.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    const formatted = appointments.map(a => ({
      id: a._id,
      patientId: a.patientId,
      doctorId: a.doctorId._id,
      doctorName: (a.doctorId as any).name,
      specialty: (a.doctorId as any).specialization,
      date: a.timeSlot.startTime.toISOString().split('T')[0],
      time: a.timeSlot.startTime.toISOString().split('T')[1].substring(0, 5),
      type: a.type,
      status: a.status,
      tokenNumber: a.tokenNumber,
      reasonForVisit: a.reasonForVisit,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const getQueueStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const patientId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find active appointment for today
    const appointment = await AppointmentModel.findOne({
      patientId,
      status: AppointmentStatus.IN_QUEUE,
      "timeSlot.startTime": { $gte: today },
    }).populate("doctorId", "name");

    if (!appointment) {
      res.status(200).json(null);
      return;
    }

    const queue = await QueueModel.findOne({
      doctorId: appointment.doctorId,
      queueDate: { $gte: today },
    });

    if (!queue) {
      res.status(200).json(null);
      return;
    }

    const myEntry = queue.entries.find(e => e.appointmentId.toString() === appointment._id.toString());
    const waitingBefore = queue.entries.filter(e => 
      e.status === QueueEntryStatus.WAITING && 
      e.checkedInAt < (myEntry?.checkedInAt || new Date())
    ).length;

    res.status(200).json({
      position: waitingBefore + 1,
      estimatedWaitTime: (waitingBefore + 1) * 10,
      currentServing: queue.currentToken,
      tokenNumber: myEntry?.tokenNumber,
      totalWaiting: queue.entries.filter(e => e.status === QueueEntryStatus.WAITING).length,
      doctorName: (appointment.doctorId as any).name,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching queue status" });
  }
};

export const cancelAppointment = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    if (appointment.patientId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Unauthorized to cancel this appointment" });
      return;
    }

    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();
    await appointment.save();

    // Also remove from queue if it was in queue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queue = await QueueModel.findOne({
      doctorId: appointment.doctorId,
      queueDate: { $gte: today },
    });

    if (queue) {
      queue.entries = queue.entries.filter(e => e.appointmentId.toString() !== id);
      await queue.save();
    }

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling appointment" });
  }
};
