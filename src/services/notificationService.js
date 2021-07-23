import BaseAPIService from "./baseAPIService";

export default class NotificationService extends BaseAPIService {
  static getNotificationForMe = () => {
    return this.requestWithAuth("/notifications/me", "GET");
  };
}
