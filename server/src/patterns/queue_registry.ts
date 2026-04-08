// Singleton Pattern
// Problem: the app should share one central registry of doctor queues instead
// of creating separate disconnected registries in different places.
// Solution: QueueRegistry exposes a single shared instance for storing and
// accessing queue managers across the system.


import { QueueManager } from "./queue_manager";
//Single Ton Pattern
export class QueueRegistry {
  private static instance: QueueRegistry;
  private queues: Map<string, QueueManager> = new Map();

  private constructor() { }

  static getInstance(): QueueRegistry {
    if (!QueueRegistry.instance) {
      QueueRegistry.instance = new QueueRegistry();
    }

    return QueueRegistry.instance;
  }

  addQueue(doctorId: string, queueManager: QueueManager): void {
    this.queues.set(doctorId, queueManager);
  }

  getQueue(doctorId: string): QueueManager | undefined {
    return this.queues.get(doctorId);
  }

  hasQueue(doctorId: string): boolean {
    return this.queues.has(doctorId);
  }
}
