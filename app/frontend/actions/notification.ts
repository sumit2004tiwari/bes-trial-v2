import { fetchApiHub } from "./index";

export const getMyNotifications = () => {
  return fetchApiHub("/backend/api/notification", "GET");
};

export const markNotificationsRead = (notificationId?: any) => {
  return fetchApiHub("/backend/api/notification/read", "POST", {
    notificationId: notificationId || null,
  });
};