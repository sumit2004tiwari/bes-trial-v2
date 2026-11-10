import { NextResponse } from "next/server";
import MemberService from "@/app/backend/lib/services/member-services";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import { EmailService } from "@/app/backend/lib/services/email-services";
import { generateMemberRejectedTemplate } from "@/app/backend/helper/mailHelper/template/member_profile_template";
import NotificationService from "@/app/backend/lib/services/notification/notification-service";
import { NotificationType } from "@/app/backend/lib/db/models/notification";

export async function POST(request: Request) {
  try {
    const body = await request?.json();
    const { profileId, message } = body || {};
    if (!profileId) {
      return NextResponse.json(
        { message: "Invalid Request", status: false },
        { status: 400 }
      );
    }
    if (!message || !String(message).trim()) {
      return NextResponse.json(
        { message: "Rejection message is required", status: false },
        { status: 422 }
      );
    }
    const memberService = new MemberService(true);
    const isAdmin = await memberService.isAdmin(true);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "You are not authorized", status: false },
        { status: 401 }
      );
    }
    const authService = new UserAuthService(true);
    const user = await authService.validateAndRegenerateTokenAndSetCookie();
    const result = await memberService.rejectProfile(
      profileId,
      user?.email || "admin",
      String(message).trim()
    );
    const profileForNotification = await memberService.getProfileById(profileId);
    const notifyUser: any = profileForNotification?.userId || null;
    if (notifyUser?.email) {
      try {
        await EmailService.sendMail(
          notifyUser.email,
          "Member Profile Rejected",
          generateMemberRejectedTemplate(
            `${notifyUser?.first_name || ""} ${notifyUser?.last_name || ""}`.trim() ||
              "Dear Member",
            String(message).trim()
          ),
          "Member Profile Status"
        );
      } catch (e) {
        console.error("Error sending rejection email", e?.message);
      }
      try {
        const notificationService = new NotificationService();
        await notificationService.createNotificationByEmail(notifyUser.email, {
          type: NotificationType.MemberProfile,
          title: "Member Profile Rejected",
          message: `Your member profile was rejected. Reason: ${String(
            message
          ).trim()}. Please update and resubmit.`,
        });
      } catch (e) {
        console.error("Error creating rejection notification", e?.message);
      }
    }
    return NextResponse.json({
      status: true,
      message: "Profile has been rejected successfully.",
      data: result,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}