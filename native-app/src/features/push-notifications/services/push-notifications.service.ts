import * as Notifications from "expo-notifications";

import { isExpoGo } from "../../../app/app";
import { BaseService } from "../../../core/services";
import type { NotificationPermissionStatus } from "../types";
import { Platform } from "react-native";

export class PushNotificationsService extends BaseService {
  constructor() {
    super();
  }

  // Request notification permissions
  async requestPermission(
    userId: string
  ): Promise<NotificationPermissionStatus> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus === Notifications.PermissionStatus.UNDETERMINED) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const canAskAgain =
      finalStatus === Notifications.PermissionStatus.UNDETERMINED;

    console.log("finalStatus", finalStatus);

    if (finalStatus === Notifications.PermissionStatus.GRANTED) {
      try {
        const token = await this.getFcmToken();
        if (token) {
          await this.registerDevice(userId, token);
        }
      } catch (error) {
        console.log(error);
      }
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

  private async registerDevice(userId: string, token: string): Promise<void> {
    await this.post("/api/push/register", {
      userId,
      deviceToken: token,
      platform: Platform.OS,
    });
  }
}
