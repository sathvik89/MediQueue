import { Response } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user_model";
import { AppointmentModel } from "../models/appointment_model";
import { QueueModel } from "../models/queue_model";
import {
  AppointmentStatus,
  AvailabilityStatus,
  UserRole,
} from "../types/system.types";

export const getSystemStats = async (_req: any, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalPatientsToday, activeDoctors, totalAppointments, queues] =
      await Promise.all([
        AppointmentModel.countDocuments({ createdAt: { $gte: today } }),
        UserModel.countDocuments({
          role: UserRole.DOCTOR,
          isActive: true,
          availabilityStatus: { $ne: AvailabilityStatus.OFF_DUTY },
        }),
        AppointmentModel.countDocuments({}),
        QueueModel.find({ queueDate: { $gte: today } }).select("entries"),
      ]);

    const waitingEntries = queues.flatMap((queue: any) =>
      queue.entries.filter((entry: any) => entry.status === "WAITING")
    );

    res.status(200).json({
      totalPatientsToday,
      activeDoctors,
      averageWaitTime: waitingEntries.length ? waitingEntries.length * 10 : 0,
      totalAppointments,
    });
  } catch (error) {
    console.error("getSystemStats error:", error);
    res.status(500).json({ message: "Error fetching system stats" });
  }
};

export const addDoctor = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, specialty, email, phone, password } = req.body;

    if (!name || !specialty) {
      res.status(400).json({ message: "Doctor name and specialty are required" });
      return;
    }

    const generatedEmail =
      email ||
      `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "")}.${Date.now()}@mediqueue.local`;
    const generatedPhone = phone || "0000000000";
    const generatedPassword = password || "password123";

    const existingDoctor = await UserModel.findOne({ email: generatedEmail });
    if (existingDoctor) {
      res.status(409).json({ message: "A user with this email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(generatedPassword, salt);

    const doctor = await UserModel.create({
      name,
      email: generatedEmail,
      phone: generatedPhone,
      passwordHash,
      role: UserRole.DOCTOR,
      specialization: specialty,
      isActive: true,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    });

    res.status(201).json({
      id: doctor._id,
      name: doctor.name,
      specialty: doctor.specialization || "General Medicine",
      availability: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      availabilityStatus: doctor.availabilityStatus,
      imageUrl: (doctor as any).imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`,
    });
  } catch (error) {
    console.error("addDoctor error:", error);
    res.status(500).json({ message: "Error adding doctor" });
  }
};

export const getAllDoctors = async (_req: any, res: Response): Promise<void> => {
  try {
    const doctors = await UserModel.find({
      role: UserRole.DOCTOR,
      isActive: true,
    }).select("name specialization availabilityStatus imageUrl");

    res.status(200).json(
      doctors.map((doctor: any) => ({
        id: doctor._id,
        name: doctor.name,
        specialty: doctor.specialization || "General Medicine",
        availability: ["09:00", "10:00", "11:00", "14:00", "15:00"],
        availabilityStatus: doctor.availabilityStatus || AvailabilityStatus.AVAILABLE,
        imageUrl: doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`,
      }))
    );
  } catch (error) {
    console.error("getAllDoctors error:", error);
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

export const removeDoctor = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctor = await UserModel.findOneAndUpdate(
      { _id: id, role: UserRole.DOCTOR },
      {
        isActive: false,
        availabilityStatus: AvailabilityStatus.OFF_DUTY,
        deactivatedAt: new Date(),
        deactivatedBy: req.user?._id,
      },
      { new: true }
    );

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.status(200).json({ message: "Doctor removed successfully" });
  } catch (error) {
    console.error("removeDoctor error:", error);
    res.status(500).json({ message: "Error removing doctor" });
  }
};

export const toggleDoctorStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctor = await UserModel.findOne({ _id: id, role: UserRole.DOCTOR });

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    doctor.availabilityStatus =
      doctor.availabilityStatus === AvailabilityStatus.OFF_DUTY
        ? AvailabilityStatus.AVAILABLE
        : AvailabilityStatus.OFF_DUTY;
    doctor.isActive = true;
    await doctor.save();

    res.status(200).json({
      message: "Doctor status updated successfully",
      availabilityStatus: doctor.availabilityStatus,
    });
  } catch (error) {
    console.error("toggleDoctorStatus error:", error);
    res.status(500).json({ message: "Error updating doctor status" });
  }
};

export const getAllPatients = async (req: any, res: Response): Promise<void> => {
  try {
    const { query = "", sortBy = "newest" } = req.query;
    const search = String(query).trim();

    const filter: any = { role: UserRole.PATIENT };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sort =
      sortBy === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const patients = await UserModel.find(filter)
      .select("name email phone createdAt")
      .sort(sort as any);

    const appointmentCounts = await AppointmentModel.aggregate([
      { $match: { patientId: { $in: patients.map((patient: any) => patient._id) } } },
      { $group: { _id: "$patientId", count: { $sum: 1 } } },
    ]);

    const countsByPatient = new Map(
      appointmentCounts.map((item: any) => [item._id.toString(), item.count])
    );

    let formatted = patients.map((patient: any) => ({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      joinDate: patient.createdAt?.toISOString() || new Date().toISOString(),
      totalAppointments: countsByPatient.get(patient._id.toString()) || 0,
    }));

    if (sortBy === "appointments") {
      formatted = formatted.sort((a, b) => b.totalAppointments - a.totalAppointments);
    }

    res.status(200).json(formatted);
  } catch (error) {
    console.error("getAllPatients error:", error);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

export const getSchedulingConflicts = async (_req: any, res: Response): Promise<void> => {
  try {
    const conflicts = await AppointmentModel.aggregate([
      {
        $match: {
          status: {
            $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED],
          },
        },
      },
      {
        $group: {
          _id: {
            doctorId: "$doctorId",
            startTime: "$timeSlot.startTime",
          },
          count: { $sum: 1 },
          appointmentIds: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id.doctorId",
          foreignField: "_id",
          as: "doctor",
        },
      },
      { $unwind: "$doctor" },
      { $limit: 10 },
    ]);

    res.status(200).json(
      conflicts.map((conflict: any) => ({
        id: conflict.appointmentIds[0].toString(),
        doctorName: conflict.doctor.name,
        timeSlot: new Date(conflict._id.startTime).toLocaleString(),
        issue: `${conflict.count} appointments booked for the same slot`,
      }))
    );
  } catch (error) {
    console.error("getSchedulingConflicts error:", error);
    res.status(500).json({ message: "Error fetching conflicts" });
  }
};

export const resolveConflict = async (req: any, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await AppointmentModel.findByIdAndUpdate(id, {
      status: AppointmentStatus.RESCHEDULED,
      adminOverrideReason: "Marked for manual rescheduling by admin",
    });
    res.status(200).json({ message: "Conflict marked for rescheduling" });
  } catch (error) {
    console.error("resolveConflict error:", error);
    res.status(500).json({ message: "Error resolving conflict" });
  }
};
