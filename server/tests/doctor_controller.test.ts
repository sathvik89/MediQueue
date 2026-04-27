import test from "node:test";
import assert from "node:assert/strict";
import {
  completeConsultation,
  getDoctorQueue,
} from "../src/controllers/doctor_controller";
import { AppointmentModel } from "../src/models/appointment_model";
import { MedicalRecordModel } from "../src/models/medical_record_model";
import { QueueModel } from "../src/models/queue_model";
import { AppointmentStatus, CasePriority, QueueEntryStatus } from "../src/types/system.types";
import { createResponse } from "./helpers/mock_response";

const originalAppointmentFindByIdAndUpdate = AppointmentModel.findByIdAndUpdate;
const originalMedicalRecordCreate = MedicalRecordModel.create;
const originalQueueFindOne = QueueModel.findOne;

test.afterEach(() => {
  AppointmentModel.findByIdAndUpdate = originalAppointmentFindByIdAndUpdate;
  MedicalRecordModel.create = originalMedicalRecordCreate;
  QueueModel.findOne = originalQueueFindOne;
});

test("getDoctorQueue formats today's queue for the doctor dashboard", async () => {
  const queue = {
    entries: [
      {
        appointmentId: {
          _id: { toString: () => "appointment-1" },
          reasonForVisit: "Chest pain",
        },
        patientId: { name: "Asha Rao", email: "asha@example.com" },
        status: QueueEntryStatus.WAITING,
        priority: CasePriority.CRITICAL,
        tokenNumber: 7,
      },
      {
        appointmentId: {
          _id: { toString: () => "appointment-2" },
          reasonForVisit: "Follow-up",
        },
        patientId: { name: "Ravi Kumar", email: "ravi@example.com" },
        status: QueueEntryStatus.DONE,
        priority: CasePriority.NORMAL,
        tokenNumber: 8,
      },
    ],
    populate() {
      return this;
    },
  };

  (QueueModel.findOne as any) = () => queue;

  const req = { user: { _id: "doctor-1" } };
  const res = createResponse();

  await getDoctorQueue(req as any, res as any);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, [
    {
      id: "appointment-1",
      patientName: "Asha Rao",
      timeSlot: "N/A",
      status: "waiting",
      issues: "Chest pain",
      priority: CasePriority.CRITICAL,
      tokenNumber: 7,
      isCritical: true,
    },
    {
      id: "appointment-2",
      patientName: "Ravi Kumar",
      timeSlot: "N/A",
      status: "completed",
      issues: "Follow-up",
      priority: CasePriority.NORMAL,
      tokenNumber: 8,
      isCritical: false,
    },
  ]);
});

test("completeConsultation completes appointment, updates queue entry, and creates medical record", async () => {
  const appointment = {
    _id: "appointment-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
  };
  const queue = {
    entries: [
      {
        appointmentId: { toString: () => "appointment-1" },
        status: QueueEntryStatus.IN_PROGRESS,
      },
    ],
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    },
  };
  let appointmentUpdate: any;
  let medicalRecordPayload: any;

  (AppointmentModel.findByIdAndUpdate as any) = async (_id: string, update: any) => {
    appointmentUpdate = update;
    return appointment;
  };
  (QueueModel.findOne as any) = async () => queue;
  (MedicalRecordModel.create as any) = async (payload: any) => {
    medicalRecordPayload = payload;
    return payload;
  };

  const req = {
    params: { id: "appointment-1" },
    body: {
      diagnosis: "Viral fever",
      medicines: ["Paracetamol"],
      notes: "Rest and hydration",
      followUpDate: "2026-05-01",
      isCritical: false,
    },
  };
  const res = createResponse();

  await completeConsultation(req as any, res as any);

  assert.equal(res.statusCode, 200);
  assert.equal(appointmentUpdate.status, AppointmentStatus.COMPLETED);
  assert.ok(appointmentUpdate.completedAt instanceof Date);
  assert.equal(queue.entries[0].status, QueueEntryStatus.DONE);
  assert.equal(queue.saveCalled, true);
  assert.equal(medicalRecordPayload.patientId, "patient-1");
  assert.equal(medicalRecordPayload.doctorId, "doctor-1");
  assert.equal(medicalRecordPayload.appointmentId, "appointment-1");
  assert.equal(medicalRecordPayload.diagnosis, "Viral fever");
  assert.deepEqual(medicalRecordPayload.prescription.medicines, ["Paracetamol"]);
  assert.ok(medicalRecordPayload.followUp.date instanceof Date);
  assert.deepEqual(res.body, { message: "Consultation completed successfully" });
});
