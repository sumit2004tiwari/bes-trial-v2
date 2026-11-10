import { NextResponse } from "next/server";
import { sendMailToUser } from "../../action/action";
import JwtTokenService from "@/app/backend/lib/services/jwt-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = body?.token || "";
    if (!token) {
      return NextResponse.json(
        { message: "Invalid request, token is required", status: false },
        { status: 400 }
      );
    }

    const jwtService = new JwtTokenService();
    const isValid = await jwtService.verifyToken(token);
    if (!isValid) {
      return NextResponse.json(
        { message: "Badge token is invalid or expired", status: false },
        { status: 401 }
      );
    }

    const payload: any = await jwtService.decodeToken(token);
    const email = payload?.email;
    if (!email) {
      return NextResponse.json(
        { message: "Invalid badge token payload", status: false },
        { status: 401 }
      );
    }

    await sendMailToUser(email);
    return NextResponse.json({
      message: "OTP has been sent to your email address",
      status: true,
    });
  } catch (e) {
    console.log("error while resending badge otp", e?.message);
    return NextResponse.json(
      { message: "Something went wrong, please try again later", status: false },
      { status: 500 }
    );
  }
}