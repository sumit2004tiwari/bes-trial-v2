// services/EmailService.ts
import {
  EMAIL_SERVICE,
  SENDER_EMAIL,
  SENDER_EMAIL_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
} from "@/app/backend/constant";
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    host: SMTP_HOST,
    port: SMTP_PORT as any,
    secure: true, // true for 465, false for other ports
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_EMAIL_PASSWORD,
    },
  });

  // Send email
  static async sendMail(
    to: string,
    subject: string,
    html: string,
    from?: string,
  ) {
    return this.transporter.sendMail({
      from: from || `"No Reply" <${SENDER_EMAIL}>`,
      to,
      subject: `${subject} ${new Date().toISOString().slice(11, 16)}`,
      html,
    });
  }
}
