import * as Notifications from "expo-notifications";

import { isExpoGo } from "../../../app/app";
import { BaseService } from "../../../core/services";
import type { NotificationPermissionStatus } from "../types";

export class PushNotificationsService extends BaseService {
  constructor() {
    super();
  }

  // Request notification permissions
  async requestPermission(): Promise<NotificationPermissionStatus> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus === Notifications.PermissionStatus.UNDETERMINED) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const canAskAgain =
      finalStatus === Notifications.PermissionStatus.UNDETERMINED;

    try {
      const token = await this.getFcmToken();
      console.log("FCM TOKEN:", token);
    } catch (error) {
      console.error(error);
    }

    return {
      status: finalStatus as Notifications.PermissionStatus,
      canAskAgain,
    };
  }

  private async getFcmToken(): Promise<string | null> {
    if (isExpoGo()) {
      return null;
    }

    const { getMessaging, requestPermission, getToken, AuthorizationStatus } =
      await import("@react-native-firebase/messaging");

    const messaging = getMessaging();
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return await getToken(messaging);
    }
    return null;
  }
}
