import { NextResponse } from "next/server";
import MemberService from "@/app/backend/lib/services/member-services";

export async function GET() {
  try {
    const memberService = new MemberService(true);
    const isAdmin = await memberService.isAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized", status: false },
        { status: 401 }
      );
    }
    const data = await memberService.getAllProfilesForAdmin();
    return NextResponse.json({
      status: true,
      data: data || [],
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}