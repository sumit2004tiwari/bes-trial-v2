import { NextResponse } from "next/server";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import NotificationService from "@/app/backend/lib/services/notification/notification-service";

export async function POST(request: Request) {
  try {
    const authService = new UserAuthService(true);
    const user = await authService.validateAndRegenerateTokenAndSetCookie();
    if (!user) {
      return NextResponse.json(
        { message: "You are not authorized", status: false },
        { status: 401 }
      );
    }
    const body = await request?.json().catch(() => ({}));
    const { notificationId } = body || {};
    const notificationService = new NotificationService();
    if (notificationId) {
      await notificationService.markRead(user?.email, String(notificationId));
    } else {
      await notificationService.markAllRead(user?.email);
    }
    const unreadCount = await notificationService.getUnreadCount(user?.email);
    return NextResponse.json({
      status: true,
      message: "Notifications marked as read.",
      data: { unreadCount },
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}