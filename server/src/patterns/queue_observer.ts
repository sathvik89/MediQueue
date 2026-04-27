// Observer Pattern
// Problem: patients and doctors need live queue updates whenever queue data
// changes, without tightly coupling the queue to UI-specific code.
// Solution: observer classes listen for queue updates and store the latest
// queue view that matters to them.
import { IQueueObserver } from "../interfaces/queue_observer_interface";
import { QueueSnapshot } from "../types/system.types";

export class PatientQueueObserver implements IQueueObserver {
  private latestQueue: QueueSnapshot | null = null;

  constructor(private readonly patientId: string) {}

  update(snapshot: QueueSnapshot): void {
    const isInQueue = snapshot.entries.some(
      (entry) => entry.patientId === this.patientId,
    );

    if (isInQueue) {
      this.latestQueue = snapshot;
    }
  }

  view(): QueueSnapshot | null {
    return this.latestQueue;
  }
}

export class DoctorQueueObserver implements IQueueObserver {
  private latestQueue: QueueSnapshot | null = null;

  update(snapshot: QueueSnapshot): void {
    this.latestQueue = snapshot;
  }

  view(): QueueSnapshot | null {
    return this.latestQueue;
  }
}
