import test from "node:test";
import assert from "node:assert/strict";
import {
  bookAppointment,
  cancelAppointment,
  getQueueStatus,
} from "../src/controllers/patient_controller";
import { AppointmentModel } from "../src/models/appointment_model";
import { QueueModel } from "../src/models/queue_model";
import {
  AppointmentStatus,
  AppointmentType,
  CasePriority,
  QueueEntryStatus,
} from "../src/types/system.types";
import { createResponse } from "./helpers/mock_response";

const originalAppointmentCreate = AppointmentModel.create;
const originalAppointmentFindById = AppointmentModel.findById;
const originalAppointmentFindOne = AppointmentModel.findOne;
const originalQueueCreate = QueueModel.create;
const originalQueueFindOne = QueueModel.findOne;

const todayDate = () => new Date().toISOString().split("T")[0];

test.afterEach(() => {
  AppointmentModel.create = originalAppointmentCreate;
  AppointmentModel.findById = originalAppointmentFindById;
  AppointmentModel.findOne = originalAppointmentFindOne;
  QueueModel.create = originalQueueCreate;
  QueueModel.findOne = originalQueueFindOne;
});

test("bookAppointment creates an appointment and adds today's appointment to the queue", async () => {
  const savedAppointment = {
    _id: "appointment-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    priority: CasePriority.HIGH,
    status: AppointmentStatus.CONFIRMED,
    tokenNumber: undefined as number | undefined,
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    },
  };
  const savedQueue = {
    entries: [] as any[],
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    },
  };
  let appointmentPayload: any;

  (AppointmentModel.create as any) = async (payload: any) => {
    appointmentPayload = payload;
    return savedAppointment;
  };
  (QueueModel.findOne as any) = async () => null;
  (QueueModel.create as any) = async () => savedQueue;

  const req = {
    user: { _id: "patient-1" },
    body: {
      doctorId: "doctor-1",
      date: todayDate(),
      time: "10:00",
      type: AppointmentType.SCHEDULED,
      reasonForVisit: "Fever",
      priority: CasePriority.HIGH,
    },
  };
  const res = createResponse();

  await bookAppointment(req as any, res as any);

  assert.equal(res.statusCode, 201);
  assert.equal(appointmentPayload.patientId, "patient-1");
  assert.equal(appointmentPayload.doctorId, "doctor-1");
  assert.equal(appointmentPayload.status, AppointmentStatus.CONFIRMED);
  assert.equal(savedQueue.entries.length, 1);
  assert.equal(savedQueue.entries[0].tokenNumber, 1);
  assert.equal(savedQueue.entries[0].status, QueueEntryStatus.WAITING);
  assert.equal(savedAppointment.tokenNumber, 1);
  assert.equal(savedAppointment.status, AppointmentStatus.IN_QUEUE);
  assert.equal(savedAppointment.saveCalled, true);
  assert.equal(savedQueue.saveCalled, true);
});

test("cancelAppointment marks the appointment cancelled and removes it from today's queue", async () => {
  const appointment = {
    patientId: { toString: () => "patient-1" },
    doctorId: "doctor-1",
    status: AppointmentStatus.CONFIRMED,
    cancelledAt: undefined as Date | undefined,
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    },
  };
  const queue = {
    entries: [
      { appointmentId: { toString: () => "appointment-1" } },
      { appointmentId: { toString: () => "appointment-2" } },
    ],
    saveCalled: false,
    async save() {
      this.saveCalled = true;
    },
  };

  (AppointmentModel.findById as any) = async () => appointment;
  (QueueModel.findOne as any) = async () => queue;

  const req = {
    user: { _id: { toString: () => "patient-1" } },
    params: { id: "appointment-1" },
  };
  const res = createResponse();

  await cancelAppointment(req as any, res as any);

  assert.equal(res.statusCode, 200);
  assert.equal(appointment.status, AppointmentStatus.CANCELLED);
  assert.ok(appointment.cancelledAt instanceof Date);
  assert.equal(appointment.saveCalled, true);
  assert.equal(queue.entries.length, 1);
  assert.equal(queue.saveCalled, true);
  assert.deepEqual(res.body, { message: "Appointment cancelled successfully" });
});

test("getQueueStatus returns the patient's current queue position and wait estimate", async () => {
  const appointment = {
    _id: { toString: () => "appointment-2" },
    doctorId: {
      _id: "doctor-1",
      name: "Dr. Carter",
    },
  };
  const queue = {
    currentToken: 4,
    entries: [
      {
        appointmentId: { toString: () => "appointment-1" },
        status: QueueEntryStatus.WAITING,
        checkedInAt: new Date("2026-04-27T09:00:00.000Z"),
        tokenNumber: 1,
      },
      {
        appointmentId: { toString: () => "appointment-2" },
        status: QueueEntryStatus.WAITING,
        checkedInAt: new Date("2026-04-27T09:10:00.000Z"),
        tokenNumber: 2,
      },
      {
        appointmentId: { toString: () => "appointment-3" },
        status: QueueEntryStatus.DONE,
        checkedInAt: new Date("2026-04-27T08:50:00.000Z"),
        tokenNumber: 3,
      },
    ],
  };

  (AppointmentModel.findOne as any) = () => ({
    populate: async () => appointment,
  });
  (QueueModel.findOne as any) = async () => queue;

  const req = { user: { _id: "patient-1" } };
  const res = createResponse();

  await getQueueStatus(req as any, res as any);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    position: 2,
    estimatedWaitTime: 20,
    currentServing: 4,
    tokenNumber: 2,
    totalWaiting: 2,
    doctorName: "Dr. Carter",
  });
});
