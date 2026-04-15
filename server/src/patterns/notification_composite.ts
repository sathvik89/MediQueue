// Composite Pattern
// Problem: one MediQueue event may need to notify users through many channels
// like SMS, email, and push at the same time.
// Solution: NotificationGroup treats multiple channels like one channel and
// forwards the same message to all registered notification handlers.
import { INotificationChannel } from "../interfaces/notification_interface";
import { NotificationMessage } from "../types/system.types";

export class NotificationGroup implements INotificationChannel {
  private channels: INotificationChannel[] = [];
  //channel = email/sms/push

  add(channel: INotificationChannel): void {
    this.channels.push(channel);
  }

  remove(channel: INotificationChannel): void {
    this.channels = this.channels.filter((item) => item !== channel);
  }

  send(message: NotificationMessage): void {//recursive way
    //type NotificationMessage = {
    //   userId: string;
    //   title: string;
    //   body: string;
    //   type: NotificationType;
    //   createdAt: Date;
    // // };
    this.channels.forEach((channel) => channel.send(message));
  }
}
