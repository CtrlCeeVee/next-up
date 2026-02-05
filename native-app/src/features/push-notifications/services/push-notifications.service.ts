import * as Notifications from "expo-notifications";
import { BaseService } from "../../../core/services";
import type { NotificationPermissionStatus } from "../types";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  requestPermission
} from "@react-native-firebase/messaging";

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

    const token = await this.getFcmToken();
    console.log("FCM TOKEN:", token);

    return {
      status: finalStatus as Notifications.PermissionStatus,
      canAskAgain,
    };
  }

  private async getFcmToken(): Promise<string | null> {
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
