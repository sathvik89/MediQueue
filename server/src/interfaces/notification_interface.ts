import { NotificationMessage } from "../types/system.types";

export interface INotificationChannel {
  send(message: NotificationMessage): void;
}
