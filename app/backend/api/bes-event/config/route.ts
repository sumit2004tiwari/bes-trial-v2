import { NextResponse } from "next/server";
import BesEventConfigService, {
  getPrefixReferenceNumber,
} from "@/app/backend/lib/services/bes-event-config-service";
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
    const service = new BesEventConfigService();
    const config = await service.getCurrentEventConfig();
    const prefix = await getPrefixReferenceNumber();
    return NextResponse.json({
      status: true,
      data: {
        config: config || null,
        prefix,
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
    const memberService = new MemberService(true);
    const isAdmin = await memberService.isAdmin(true);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized", status: false },
        { status: 401 }
      );
    }
    const body = await request?.json().catch(() => ({}));
    const { eventYear } = body || {};
    const year = Number(eventYear);
    if (!year) {
      return NextResponse.json(
        { message: "A valid event year is required", status: false },
        { status: 422 }
      );
    }
    const service = new BesEventConfigService();
    const config = await service.setEventYear(year);
    if (!config) {
      return NextResponse.json(
        { message: "Invalid event year", status: false },
        { status: 422 }
      );
    }
    const prefix = await getPrefixReferenceNumber();
    return NextResponse.json({
      status: true,
      message: `Prefix updated to ${prefix}`,
      data: { config, prefix },
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}