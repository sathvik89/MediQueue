import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const UserRole = {
  DOCTOR: "DOCTOR"
};

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  role: String,
  specialization: String,
  isActive: { type: Boolean, default: true },
  availabilityStatus: { type: String, default: "AVAILABLE" }
});

const User = mongoose.model('User', userSchema);

const seedDoctors = [
  {
    name: "Dr. Sarah Johnson",
    email: "sarah.j@mediqueue.com",
    phone: "9876543210",
    specialization: "Gynecologist",
  },
  {
    name: "Dr. Michael Chen",
    email: "m.chen@mediqueue.com",
    phone: "9876543211",
    specialization: "Dermatologist",
  },
  {
    name: "Dr. Emily Williams",
    email: "emily.w@mediqueue.com",
    phone: "9876543212",
    specialization: "Pediatricians",
  },
  {
    name: "Dr. Robert Miller",
    email: "r.miller@mediqueue.com",
    phone: "9876543213",
    specialization: "Gastroenterologist",
  },
  {
    name: "Dr. Alice Brown",
    email: "alice.b@mediqueue.com",
    phone: "9876543214",
    specialization: "Gynecologist",
  },
  {
    name: "Dr. David Wilson",
    email: "d.wilson@mediqueue.com",
    phone: "9876543215",
    specialization: "Pediatricians",
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to DB');

    for (const docData of seedDoctors) {
      try {
        await User.create({
          ...docData,
          passwordHash: "$2b$10$7rXW6k6.6k6.6k6.6k6.6u", // dummy hash
          role: UserRole.DOCTOR,
          isActive: true,
          availabilityStatus: "AVAILABLE"
        });
        console.log(`Created: ${docData.name} (${docData.specialization})`);
      } catch (err: any) {
        if (err.code === 11000) {
          console.log(`Skipping duplicate: ${docData.name}`);
        } else {
          console.error(`Error creating ${docData.name}:`, err.message);
        }
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
