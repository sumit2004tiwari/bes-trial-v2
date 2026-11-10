import CustomError from "@/app/_shared/custom-error";
import { LoginError } from "@/app/_shared/custom-error/login-error";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = body?.payload || "";
    if (!payload) {
      throw LoginError.resendOrSendOtpEmail();
    }

    const userService = new UserAuthService();
    let result = await userService.sendOtpForAdminLogin(payload);
    if (!result) {
      throw LoginError.resendOrSendOtpEmail();
    }
    return new Response(
      JSON.stringify({ message: "Logout Successfully", loginStatus: false }),
      { status: 200 }
    );
  } catch (error: any) {
    const e = error as CustomError;
    console.log("error while resending otp", e?.newMessage);
    return new Response(
      JSON.stringify({
        message: e?.newMessage || "Something went wrong",
        loginStatus: false,
      }),
      { status: e?.statusCode || 500 }
    );
  }
}
