import { NextResponse } from "next/server";
import MemberService from "@/app/backend/lib/services/member-services";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import { EmailService } from "@/app/backend/lib/services/email-services";
import { generateMemberApprovedTemplate } from "@/app/backend/helper/mailHelper/template/member_profile_template";
import NotificationService from "@/app/backend/lib/services/notification/notification-service";
import { NotificationType } from "@/app/backend/lib/db/models/notification";

export async function POST(request: Request) {
  try {
    const body = await request?.json();
    const { profileId } = body || {};
    if (!profileId) {
      return NextResponse.json(
        { message: "Invalid Request", status: false },
        { status: 400 }
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
    const result = await memberService.approveProfile(
      profileId,
      user?.email || "admin"
    );
    const profileForNotification = await memberService.getProfileById(profileId);
    const notifyUser: any = profileForNotification?.userId || null;
    if (notifyUser?.email) {
      try {
        await EmailService.sendMail(
          notifyUser.email,
          "Member Profile Approved",
          generateMemberApprovedTemplate(
            `${notifyUser?.first_name || ""} ${notifyUser?.last_name || ""}`.trim() ||
              "Dear Member",
            result?.membership_no
          ),
          "Member Profile Status"
        );
      } catch (e) {
        console.error("Error sending approval email", e?.message);
      }
      try {
        const notificationService = new NotificationService();
        await notificationService.createNotificationByEmail(notifyUser.email, {
          type: NotificationType.MemberProfile,
          title: "Member Profile Approved",
          message: `Congratulations! Your member profile ${
            result?.membership_no ? `(${result.membership_no}) ` : ""
          }has been approved.`,
        });
      } catch (e) {
        console.error("Error creating approval notification", e?.message);
      }
    }
    return NextResponse.json({
      status: true,
      message: "Profile has been approved successfully.",
      data: result,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}