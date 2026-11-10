import { NextResponse } from "next/server";
import UserAuthService from "@/app/backend/lib/services/auth-service/user-auth-service";
import NotificationService from "@/app/backend/lib/services/notification/notification-service";
import { NotificationType } from "@/app/backend/lib/db/models/notification";

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
    const notificationService = new NotificationService();
    const notifications = await notificationService.getMyNotifications(
      user?.email
    );
    const unreadCount = await notificationService.getUnreadCount(user?.email);
    return NextResponse.json({
      status: true,
      data: { notifications: notifications || [], unreadCount },
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
        { message: "You are not authorized", status: false },
        { status: 401 }
      );
    }
    const body = await request?.json().catch(() => ({}));
    const { title, message, type } = body || {};
    if (!title || !message) {
      return NextResponse.json(
        { message: "Title and message are required", status: false },
        { status: 422 }
      );
    }
    const notificationService = new NotificationService();
    const notification = await notificationService.createNotificationByEmail(
      user?.email,
      {
        title: String(title),
        message: String(message),
        type: type || NotificationType.General,
      }
    );
    return NextResponse.json({
      status: true,
      message: "Notification created successfully.",
      data: notification,
    });
  } catch (e) {
    return NextResponse.json(
      { message: e?.newMessage || "Internal Server Error", status: false },
      { status: e?.statusCode || 500 }
    );
  }
}