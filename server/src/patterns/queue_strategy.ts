import { IAppointment } from "../../interfaces/IAppointment";
import { IQueueStrategy } from "../../interfaces/IQueue";

// STRATEGY PATTERN
// Each class is a different algorithm for ordering the queue.
// Swapping the strategy changes behaviour without touching QueueService.

// Strategy A: First come, first served — sort by creation time
export class FIFOStrategy implements IQueueStrategy {
  sort(appointments: IAppointment[]): IAppointment[] {
    return [...appointments].sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
    );
  }
}

// Strategy B: Emergency patients jump to the front, others stay FIFO
export class PriorityStrategy implements IQueueStrategy {
  sort(appointments: IAppointment[]): IAppointment[] {
    // We need patient emergency flag — stored as a convention in scheduledAt=null for walkins
    // Emergency walkins (type=walkin + no scheduledAt) are sorted first
    return [...appointments].sort((a, b) => {
      const aIsEmergency = a.type === "walkin" && !a.scheduledAt ? -1 : 1;
      const bIsEmergency = b.type === "walkin" && !b.scheduledAt ? -1 : 1;
      if (aIsEmergency !== bIsEmergency) return aIsEmergency - bIsEmergency;
      return (
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
      );
    });
  }
}

// Context: the object that uses whichever strategy is injected — Dependency Inversion
export class QueueContext {
  private strategy: IQueueStrategy;

  constructor(strategy: IQueueStrategy) {
    this.strategy = strategy;
  }

  // OCP: swap strategy at runtime without changing this class
  setStrategy(strategy: IQueueStrategy): void {
    this.strategy = strategy;
  }

  executeSort(appointments: IAppointment[]): IAppointment[] {
    return this.strategy.sort(appointments);
  }
}
