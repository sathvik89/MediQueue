import test from "node:test";
import assert from "node:assert/strict";
import {
  FIFOQueueStrategy,
  PriorityQueueStrategy,
  RoundRobinQueueStrategy,
} from "../src/patterns/queue_strategy";
import { CasePriority, QueueEntry, QueueEntryStatus } from "../src/types/system.types";

const makeEntry = (
  tokenNumber: number,
  priority: CasePriority,
  checkedInAt: string
): QueueEntry => ({
  appointmentId: `appointment-${tokenNumber}`,
  patientId: `patient-${tokenNumber}`,
  doctorId: "doctor-1",
  tokenNumber,
  priority,
  checkedInAt: new Date(checkedInAt),
  status: QueueEntryStatus.WAITING,
});

test("FIFO queue strategy returns patients in check-in order", () => {
  const entries = [
    makeEntry(3, CasePriority.NORMAL, "2026-04-27T09:20:00.000Z"),
    makeEntry(1, CasePriority.NORMAL, "2026-04-27T09:00:00.000Z"),
    makeEntry(2, CasePriority.NORMAL, "2026-04-27T09:10:00.000Z"),
  ];

  const sorted = new FIFOQueueStrategy().sort(entries);

  assert.deepEqual(
    sorted.map((entry) => entry.tokenNumber),
    [1, 2, 3]
  );
  assert.deepEqual(
    entries.map((entry) => entry.tokenNumber),
    [3, 1, 2],
    "strategy should not mutate the original queue"
  );
});

test("priority queue strategy serves higher priority patients first", () => {
  const entries = [
    makeEntry(1, CasePriority.NORMAL, "2026-04-27T09:00:00.000Z"),
    makeEntry(2, CasePriority.CRITICAL, "2026-04-27T09:15:00.000Z"),
    makeEntry(3, CasePriority.HIGH, "2026-04-27T09:05:00.000Z"),
  ];

  const sorted = new PriorityQueueStrategy().sort(entries);

  assert.deepEqual(
    sorted.map((entry) => entry.tokenNumber),
    [2, 3, 1]
  );
});

test("priority queue strategy uses check-in time when priorities match", () => {
  const entries = [
    makeEntry(1, CasePriority.HIGH, "2026-04-27T09:30:00.000Z"),
    makeEntry(2, CasePriority.HIGH, "2026-04-27T09:05:00.000Z"),
    makeEntry(3, CasePriority.HIGH, "2026-04-27T09:20:00.000Z"),
  ];

  const sorted = new PriorityQueueStrategy().sort(entries);

  assert.deepEqual(
    sorted.map((entry) => entry.tokenNumber),
    [2, 3, 1]
  );
});

test("round-robin queue strategy rotates the next starting token", () => {
  const entries = [
    makeEntry(3, CasePriority.NORMAL, "2026-04-27T09:20:00.000Z"),
    makeEntry(1, CasePriority.NORMAL, "2026-04-27T09:00:00.000Z"),
    makeEntry(2, CasePriority.NORMAL, "2026-04-27T09:10:00.000Z"),
  ];
  const strategy = new RoundRobinQueueStrategy();

  assert.deepEqual(
    strategy.sort(entries).map((entry) => entry.tokenNumber),
    [1, 2, 3]
  );
  assert.deepEqual(
    strategy.sort(entries).map((entry) => entry.tokenNumber),
    [2, 3, 1]
  );
});
