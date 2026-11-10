import mongoConnection from "@/app/backend/lib/db/db-config";
import emailVerification from "@/app/backend/models/email_verification.model";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    await mongoConnection.connect();
    let json = await req.json();
    let { email, otp } = json;
    if (email && otp) {
      otp = Number(otp);
      let user = await emailVerification.findOne({ email, otpCode: otp });
      if (user) {
        await emailVerification.updateOne({ email }, { isVerified: true });
        return NextResponse.json(
          {
            message: "Email verify SuccessFully",
            status: true,
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          message: "Verification faild, please enter valid email or otp",
          status: false,
        },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { message: "Please enter valid user or otp", status: false },
        { status: 401 }
      );
    }
  } catch (e) {}
}
