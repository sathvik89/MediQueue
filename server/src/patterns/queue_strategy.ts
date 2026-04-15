// Strategy Pattern
// Problem: queue order can change depending on hospital needs like FIFO,
// priority handling, or round-robin flow.
// Solution: each strategy class keeps one sorting rule, and QueueManager can
// switch between them without changing its own logic.


import { IQueueStrategy } from "../interfaces/queue_strategy_interface";
import { QueueEntry } from "../types/system.types";

// /Processes patients in the order they checked in.
export class FIFOQueueStrategy implements IQueueStrategy {
  sort(entries: QueueEntry[]): QueueEntry[] {
    return [...entries].sort(
      (firstEntry, secondEntry) =>
        firstEntry.checkedInAt.getTime() - secondEntry.checkedInAt.getTime()
    );
  }
}
//Gives higher priority patients precedence, then follows check-in order.
export class PriorityQueueStrategy implements IQueueStrategy {
  sort(entries: QueueEntry[]): QueueEntry[] {
    return [...entries].sort((firstEntry, secondEntry) => {
      if (firstEntry.priority !== secondEntry.priority) {
        return secondEntry.priority - firstEntry.priority;
      }

      return firstEntry.checkedInAt.getTime() - secondEntry.checkedInAt.getTime();
    });
  }
}
//Cycles through patients in a rotating order to ensure fair distribution.
export class RoundRobinQueueStrategy implements IQueueStrategy {
  private lastToken = 0;

  sort(entries: QueueEntry[]): QueueEntry[] {
    if (entries.length === 0) {
      return [];
    }

    const orderedEntries = [...entries].sort(
      (firstEntry, secondEntry) => firstEntry.tokenNumber - secondEntry.tokenNumber
    );

    const nextIndex = orderedEntries.findIndex(
      (entry) => entry.tokenNumber > this.lastToken
    );

    const startIndex = nextIndex === -1 ? 0 : nextIndex;
    const rotatedEntries = [
      ...orderedEntries.slice(startIndex),
      ...orderedEntries.slice(0, startIndex),
    ];

    this.lastToken = rotatedEntries[0].tokenNumber;
    return rotatedEntries;
  }
}
