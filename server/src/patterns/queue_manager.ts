// Observer + Strategy Pattern
// Problem: the queue must both notify listeners about changes and support
// different queue-order rules in a flexible way.
// Solution: QueueManager acts as the observable queue subject and delegates
// sorting work to a pluggable strategy object.
import { IQueueObserver } from "../interfaces/queue_observer_interface";
import { IQueueStrategy } from "../interfaces/queue_strategy_interface";
import { IQueueSubject } from "../interfaces/queue_subject_interface";
import {
  CasePriority,
  QueueEntry,
  QueueEntryStatus,
  QueueSnapshot,
} from "../types/system.types";
import { FIFOQueueStrategy } from "./queue_strategy";

export class QueueManager implements IQueueSubject {
  private observers: IQueueObserver[] = [];
  private entries: QueueEntry[] = [];
  private strategy: IQueueStrategy;

  constructor(
    private readonly doctorId: string,
    strategy: IQueueStrategy = new FIFOQueueStrategy()
  ) {
    this.strategy = strategy;
  }

  attach(observer: IQueueObserver): void {
    this.observers.push(observer);
  }

  detach(observer: IQueueObserver): void {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(): void {
    const snapshot = this.viewQueue();
    this.observers.forEach((observer) => observer.update(snapshot));
  }

  setStrategy(strategy: IQueueStrategy): void {
    this.strategy = strategy;
    this.entries = this.strategy.sort(this.entries);
    this.notify();
  }

  addPatient(
    appointmentId: string,
    patientId: string,
    tokenNumber: number,
    priority: CasePriority = CasePriority.NORMAL
  ): void {
    this.entries.push({
      appointmentId,
      patientId,
      doctorId: this.doctorId,
      tokenNumber,
      priority,
      checkedInAt: new Date(),
      status: QueueEntryStatus.WAITING,
    });

    this.entries = this.strategy.sort(this.entries);
    this.notify();
  }

  callNext(): QueueEntry | null {
    const nextPatient = this.entries.find(
      (entry) => entry.status === QueueEntryStatus.WAITING
    );

    if (!nextPatient) {
      return null;
    }

    nextPatient.status = QueueEntryStatus.CALLED;
    this.notify();
    return nextPatient;
  }

  markDone(appointmentId: string): void {
    const entry = this.entries.find((item) => item.appointmentId === appointmentId);

    if (!entry) {
      return;
    }

    entry.status = QueueEntryStatus.DONE;
    this.notify();
  }

  viewQueue(): QueueSnapshot {
    const waitingEntries = this.entries.filter(
      (entry) => entry.status === QueueEntryStatus.WAITING
    );
    const currentEntry =
      this.entries.find((entry) => entry.status === QueueEntryStatus.CALLED) ?? null;

    return {
      doctorId: this.doctorId,
      currentToken: currentEntry?.tokenNumber ?? null,
      totalWaiting: waitingEntries.length,
      entries: [...this.entries],
    };
  }
}
