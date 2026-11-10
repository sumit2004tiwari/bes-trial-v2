import {
  EMAIL_SERVICE,
  SENDER_EMAIL,
  SENDER_EMAIL_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
} from "@/app/backend/constant";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_EMAIL_PASSWORD,
  },
});
export async function GET({ email, subject, text = "", html = "" }: any) {
  try {
    const info = await transporter.sendMail({
      from: `"besadmin 👻"<${SENDER_EMAIL}>`, // sender address
      to: email, // list of receivers
      subject: `${subject} ${new Date().toISOString().slice(11, 16)}`, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
  } catch (e) {
    console.log(e);
  }
  console.log("what happend");
  return NextResponse.json({ status: true, message: "send" }, { status: 200 });
}
