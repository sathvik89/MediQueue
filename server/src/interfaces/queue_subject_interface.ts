import { IQueueObserver } from "./queue_observer_interface";

export interface IQueueSubject {
  attach(observer: IQueueObserver): void;
  detach(observer: IQueueObserver): void;
  notify(): void;
}
