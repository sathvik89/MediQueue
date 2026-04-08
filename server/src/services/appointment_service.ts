import { AppointmentModel } from "../models/Appointment";
import { AppointmentFactory } from "../patterns/factory/AppointmentFactory";
import { IAppointment, AppointmentType } from "../interfaces/IAppointment";

// SRP: only handles appointment creation and retrieval
export class AppointmentService {
  async createAppointment(
    type: AppointmentType,
    patientId: string,
    doctorId: string,
    scheduledAt?: Date,
  ): Promise<IAppointment> {
    // Factory decides which concrete class to create — caller doesn't need to know
    const appointmentObj = AppointmentFactory.create(
      type,
      patientId,
      doctorId,
      scheduledAt,
    );

    // Log what was created — Polymorphism: describe() behaves differently per subclass
    console.log(`[AppointmentService] ${appointmentObj.describe()}`);

    const saved = await AppointmentModel.create({
      patientId: appointmentObj.patientId,
      doctorId: appointmentObj.doctorId,
      type: appointmentObj.type,
      status: appointmentObj.status,
      scheduledAt: appointmentObj.scheduledAt,
    });

    return saved.toObject() as IAppointment;
  }

  async getAppointmentsByPatient(patientId: string): Promise<IAppointment[]> {
    return AppointmentModel.find({ patientId }).lean() as Promise<
      IAppointment[]
    >;
  }

  async cancelAppointment(appointmentId: string): Promise<IAppointment | null> {
    return AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" },
      { new: true },
    ).lean() as Promise<IAppointment | null>;
  }
}
