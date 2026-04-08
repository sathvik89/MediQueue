import { QueueSnapshot } from "../types/system.types";

export interface IQueueObserver {
  update(snapshot: QueueSnapshot): void;
}
