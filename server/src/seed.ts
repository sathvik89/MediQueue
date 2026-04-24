import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import path from "path";
import { UserModel } from "./models/user_model";
import { UserRole, AvailabilityStatus } from "./types/system.types";

dotenv.config({ path: path.join(__dirname, "../.env") });

const MOCK_DOCTORS = [
  {
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@mediqueue.com",
    password: "password123",
    phone: "1234567890",
    role: UserRole.DOCTOR,
    specialization: "Cardiology",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&q=80",
    availabilityStatus: AvailabilityStatus.AVAILABLE,
  },
  {
    name: "Dr. Michael Chen",
    email: "michael.chen@mediqueue.com",
    password: "password123",
    phone: "1234567891",
    role: UserRole.DOCTOR,
    specialization: "Neurology",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&q=80",
    availabilityStatus: AvailabilityStatus.BUSY,
  },
  {
    name: "Dr. Emily Carter",
    email: "emily.carter@mediqueue.com",
    password: "password123",
    phone: "1234567892",
    role: UserRole.DOCTOR,
    specialization: "General Practice",
    imageUrl: "https://images.unsplash.com/photo-1594824432258-2e0618eb79eb?w=300&q=80",
    availabilityStatus: AvailabilityStatus.AVAILABLE,
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@mediqueue.com",
    password: "password123",
    phone: "1234567893",
    role: UserRole.DOCTOR,
    specialization: "Orthopedics",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&q=80",
    availabilityStatus: AvailabilityStatus.OFF_DUTY,
  },
];

const seedDoctors = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mediqueue";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    for (const doc of MOCK_DOCTORS) {
      const existing = await UserModel.findOne({ email: doc.email });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(doc.password, salt);
        
        await UserModel.create({
          ...doc,
          passwordHash,
          isActive: true,
        });
        console.log(`Seeded: ${doc.name}`);
      } else {
        console.log(`Skipped: ${doc.name} (already exists)`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDoctors();
