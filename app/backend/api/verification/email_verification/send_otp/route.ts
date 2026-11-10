import emailVerification from "@/app/backend/models/email_verification.model";
import { NextResponse } from "next/server";
import { sendMail } from "../../../sendMail/mail";
import { generateOtp } from "@/app/backend/helper/mailHelper/otpGenerator";
import { generateOtpTemplate } from "@/app/backend/helper/mailHelper/template/otpTemplate";
import mongoConnection from "@/app/backend/lib/db/db-config";

export async function POST(req: any) {
  try {
    await mongoConnection.connect();
    let json = await req.json();
    const { email, from } = json;
    const options = {
      new: true, // Return the updated document
      upsert: true, // Create the document if it doesn't exist
      setDefaultsOnInsert: true, // Apply schema defaults on insert
    };
    let otp = generateOtp(4);
    let data = await emailVerification.findOneAndUpdate(
      { email },
      {
        email,
        otpCode: otp,
        timeStamp: Date.now(),
        isVerified: false,
        hasOtpExpired: false,
      },
      options
    );
    await sendMail({
      email,
      subject: `Otp for Bes ${from ? from : ""} registration`,
      html: generateOtpTemplate(otp),
    });
    return NextResponse.json(
      {
        message: "Otp is Send successfully",
        status: true,
      },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "It's not you it's we , something went wrong", status: false },
      { status: 500 }
    );
  }
}
