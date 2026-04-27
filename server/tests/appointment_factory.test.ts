import test from "node:test";
import assert from "node:assert/strict";
import {
  AppointmentFactoryProvider,
  EmergencyFactory,
  ScheduledFactory,
  WalkInFactory,
} from "../src/patterns/appointment_factory";
import { AppointmentStatus, AppointmentType, CasePriority } from "../src/types/system.types";

const appointmentData = {
  id: "appointment-1",
  patientId: "patient-1",
  doctorId: "doctor-1",
  timeSlot: {
    startTime: new Date("2026-04-27T10:00:00.000Z"),
    endTime: new Date("2026-04-27T10:30:00.000Z"),
  },
};

test("appointment factory provider returns the correct factory for each appointment type", () => {
  assert.ok(AppointmentFactoryProvider.getFactory(AppointmentType.WALK_IN) instanceof WalkInFactory);
  assert.ok(AppointmentFactoryProvider.getFactory(AppointmentType.SCHEDULED) instanceof ScheduledFactory);
  assert.ok(AppointmentFactoryProvider.getFactory(AppointmentType.EMERGENCY) instanceof EmergencyFactory);
});

test("scheduled appointment factory creates a scheduled appointment with normal priority by default", () => {
  const appointment = AppointmentFactoryProvider
    .getFactory(AppointmentType.SCHEDULED)
    .create(appointmentData);

  assert.equal(appointment.type, AppointmentType.SCHEDULED);
  assert.equal(appointment.priority, CasePriority.NORMAL);
  assert.equal(appointment.status, AppointmentStatus.PENDING);
});

test("emergency appointment factory creates a critical emergency appointment by default", () => {
  const appointment = AppointmentFactoryProvider
    .getFactory(AppointmentType.EMERGENCY)
    .create(appointmentData);

  assert.equal(appointment.type, AppointmentType.EMERGENCY);
  assert.equal(appointment.priority, CasePriority.CRITICAL);
});
