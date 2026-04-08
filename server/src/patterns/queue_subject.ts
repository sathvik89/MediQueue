import { IObserver } from "../../interfaces/IQueue";

// OBSERVER PATTERN
// Subject: holds a list of observers and notifies all of them when state changes.
// This is the "publisher" side.
export class QueueSubject {
  private observers: IObserver[] = [];

  // Any observer can subscribe — Open/Closed: add new observers without changing this class
  subscribe(observer: IObserver): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: IObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  // Notify all subscribers with an event name + payload
  notify(event: string, data: unknown): void {
    this.observers.forEach((observer) => observer.update(event, data));
  }
}

// Observer 1: Notifies the patient when their turn is near
export class PatientNotifier implements IObserver {
  update(event: string, data: unknown): void {
    if (event === "QUEUE_UPDATED") {
      console.log(`[PatientNotifier] Patient alert triggered:`, data);
      // In production: send SMS / push notification here
    }
  }
}

// Observer 2: Updates the doctor's dashboard when queue changes
export class DoctorDashboard implements IObserver {
  update(event: string, data: unknown): void {
    if (event === "QUEUE_UPDATED") {
      console.log(`[DoctorDashboard] Dashboard refreshed with:`, data);
      // In production: emit via WebSocket to doctor's UI
    }
  }
}
