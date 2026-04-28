import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const UserRole = {
  DOCTOR: "DOCTOR"
};

const userSchema = new mongoose.Schema({
  role: String,
  specialization: String
});

const User = mongoose.model('User', userSchema);

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to DB');

    const doctors = await User.find({ role: UserRole.DOCTOR });
    console.log(`Found ${doctors.length} doctors`);

    for (const doc of doctors) {
      let spec = doc.specialization || '';
      console.log(`Current: ${spec}`);
      
      // Mapping logic
      if (spec.toLowerCase().includes('neuro')) spec = 'Neurologist';
      else if (spec.toLowerCase().includes('cardio')) spec = 'Cardiologist';
      else if (spec.toLowerCase().includes('derm')) spec = 'Dermatologist';
      else if (spec.toLowerCase().includes('pediatr') || spec.toLowerCase().includes('child')) spec = 'Pediatricians';
      else if (spec.toLowerCase().includes('gastro')) spec = 'Gastroenterologist';
      else if (spec.toLowerCase().includes('gyneco')) spec = 'Gynecologist';
      else spec = 'General physician';

      console.log(`Updating to: ${spec}`);
      await User.updateOne({ _id: doc._id }, { specialization: spec });
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrate();
