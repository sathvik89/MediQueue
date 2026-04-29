import { Request, Response } from "express";
import { UserModel } from "../models/user_model";
import { AppointmentModel } from "../models/appointment_model";
import { UserRole, AppointmentStatus, AvailabilityStatus } from "../types/system.types";

export const getSystemStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Basic Stats
    const totalPatientsToday = await AppointmentModel.countDocuments({
      createdAt: { $gte: today },
    });

    const activeDoctors = await UserModel.countDocuments({
      role: UserRole.DOCTOR,
      isActive: true,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    });

    const totalAppointments = await AppointmentModel.countDocuments();
    const totalPatients = await UserModel.countDocuments({ role: UserRole.PATIENT });

    // Appointment Trends (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const appointmentTrends = await AppointmentModel.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Patient Distribution
    const patientDistribution = await UserModel.aggregate([
      { $match: { role: UserRole.PATIENT } },
      {
        $group: {
          _id: "$isActive",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalPatientsToday,
      activeDoctors,
      averageWaitTime: 12,
      totalAppointments,
      totalPatients,
      appointmentTrends: appointmentTrends.map(t => ({ date: t._id, count: t.count })),
      distribution: patientDistribution.map(d => ({ name: d._id ? "Active" : "Inactive", value: d.count }))
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching system stats" });
  }
};

export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await UserModel.find({ role: UserRole.DOCTOR });
    
    const formattedDoctors = doctors.map(doc => ({
      id: doc._id,
      name: doc.name,
      specialty: doc.specialization || "General Medicine",
      availability: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      availabilityStatus: (doc as any).availabilityStatus || "AVAILABLE",
      imageUrl: (doc as any).imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=random`,
      isActive: doc.isActive,
    }));

    res.status(200).json(formattedDoctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

export const addDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, specialization } = req.body;
    
    // In a real app, you'd hash the password here
    const doctor = await UserModel.create({
      name,
      email,
      phone,
      passwordHash: "hashed_password", // Simplified for now
      role: UserRole.DOCTOR,
      specialization,
      isActive: true,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error adding doctor" });
  }
};

export const removeDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await UserModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Doctor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing doctor" });
  }
};

export const toggleDoctorStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const doctor = await UserModel.findById(id);
    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    res.status(200).json({ message: "Doctor status toggled", isActive: doctor.isActive });
  } catch (error) {
    res.status(500).json({ message: "Error toggling doctor status" });
  }
};

export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, sortBy } = req.query;
    let filter: any = { role: UserRole.PATIENT };
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    const patients = await UserModel.find(filter).sort(sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 });
    
    const formattedPatients = patients.map(p => ({
      id: p._id,
      name: p.name,
      email: p.email,
      phone: (p as any).phone || "N/A",
      joinDate: p.createdAt || new Date(2024, 0, 15), // Fallback to a valid dummy date
      totalAppointments: 0,
      status: p.isActive ? "active" : "inactive",
    }));

    res.status(200).json(formattedPatients);
  } catch (error) {
    res.status(500).json({ message: "Error fetching patients" });
  }
};
