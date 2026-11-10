import mongoConnection from "../../db/db-config";
import NotificationModel, {
  INotification,
  NotificationType,
} from "../../db/models/notification";
import UserModel from "../../db/models/user-schema";
import ErrorWithStatusCode from "@/app/_shared/custom-error/error-with-status-code";

export default class NotificationService {
  private async resolveUserId(email: string) {
    await mongoConnection.connect();
    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      throw ErrorWithStatusCode.error404("User not found");
    }
    return String(user._id);
  }

  async createNotification(
    userId: string,
    payload: {
      type?: NotificationType;
      title: string;
      message: string;
    }
  ) {
    await mongoConnection.connect();
    return NotificationModel.create({
      userId,
      type: payload.type || NotificationType.General,
      title: payload.title,
      message: payload.message,
    });
  }

  async createNotificationByEmail(
    email: string,
    payload: {
      type?: NotificationType;
      title: string;
      message: string;
    }
  ) {
    const userId = await this.resolveUserId(email);
    return this.createNotification(userId, payload);
  }

  async getMyNotifications(email: string, limit = 20) {
    const userId = await this.resolveUserId(email);
    await mongoConnection.connect();
    return NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as INotification[];
  }

  async getUnreadCount(email: string) {
    const userId = await this.resolveUserId(email);
    await mongoConnection.connect();
    return NotificationModel.countDocuments({ userId, isRead: false });
  }

  async markAllRead(email: string) {
    const userId = await this.resolveUserId(email);
    await mongoConnection.connect();
    return NotificationModel.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
  }

  async markRead(email: string, notificationId: string) {
    const userId = await this.resolveUserId(email);
    await mongoConnection.connect();
    return NotificationModel.updateOne(
      { _id: notificationId, userId },
      { $set: { isRead: true } }
    );
  }
}