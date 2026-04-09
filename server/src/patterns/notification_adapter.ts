// Adapter Pattern
// Problem: email, SMS, and push providers all expose different method names
// and parameter shapes, which makes notification code inconsistent.
// Solution: each adapter converts provider-specific calls into one simple
// send(message) interface used by the application.
import { INotificationChannel } from "../interfaces/notification_interface";
import { NotificationMessage } from "../types/system.types";

class EmailService {
  sendEmail(toUserId: string, title: string, body: string): void {
    console.log(`Email sent to ${toUserId}: ${title} - ${body}`);
  }
}

class SmsService {
  sendSms(toUserId: string, body: string): void {
    console.log(`SMS sent to ${toUserId}: ${body}`);
  }
}

class PushService {
  sendPush(toUserId: string, title: string, body: string): void {
    console.log(`Push sent to ${toUserId}: ${title} - ${body}`);
  }
}

export class EmailAdapter implements INotificationChannel {
  constructor(private readonly emailService: EmailService = new EmailService()) {}

  send(message: NotificationMessage): void {
    this.emailService.sendEmail(message.userId, message.title, message.body);
  }
}

export class SmsAdapter implements INotificationChannel {
  constructor(private readonly smsService: SmsService = new SmsService()) {}

  send(message: NotificationMessage): void {
    this.smsService.sendSms(message.userId, message.body);
  }
}

export class PushAdapter implements INotificationChannel {
  constructor(private readonly pushService: PushService = new PushService()) {}

  send(message: NotificationMessage): void {
    this.pushService.sendPush(message.userId, message.title, message.body);
  }
}
