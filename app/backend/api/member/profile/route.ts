import { NextResponse } from "next/server";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import MemberService from "@/app/backend/lib/services/member-services";
import { memberProfileSchema } from "@/app/_shared/validation-schema/member-profile";

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
    const profile = await memberService.getProfileByEmail(user.email);
    const profileObject: any = profile ? { ...profile } : null;
    if (profileObject) {
      delete profileObject.userId;
      delete profileObject.createdAt;
      delete profileObject.updatedAt;
      delete profileObject.__v;
    }
    return NextResponse.json({
      status: true,
      data: {
        profile: profileObject,
        hasSubmitted: !!profileObject,
        status: profileObject?.status || null,
        rejectionMsg: profileObject?.rejectionMsg || null,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authService = new UserAuthService(true);
    const user = await authService.validateAndRegenerateTokenAndSetCookie();
    if (!user) {
      return NextResponse.json(
        { message: "User or not authorized", status: false },
        { status: 401 }
      );
    }
    const body = await request?.json();
    const parsed = memberProfileSchema.safeParse(body || {});
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.errors[0]?.message || "Invalid form data",
          status: false,
        },
        { status: 422 }
      );
    }
    const memberService = new MemberService(true);
    const result = await memberService.submitProfile(user.email, parsed.data);
    return NextResponse.json({
      status: true,
      message: "Your member details have been submitted for approval.",
      data: result,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}