import { NextResponse } from "next/server";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import MemberService from "@/app/backend/lib/services/member-services";

export async function GET() {
  try {
    const authService = new UserAuthService(true);
    const user = await authService.validateAndRegenerateTokenAndSetCookie();
    if (!user) {
      return NextResponse.json(
        { message: "You are not authorized", status: false },
        { status: 401 }
      );
    }
    const memberService = new MemberService(true);
    const categories = await memberService.getMemberCategories();
    return NextResponse.json({
      status: true,
      data: categories || [],
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}