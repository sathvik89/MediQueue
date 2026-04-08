import { QueueEntry } from "../types/system.types";

export interface IQueueStrategy {
  sort(entries: QueueEntry[]): QueueEntry[];
}
