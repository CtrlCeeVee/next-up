import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { BaseService } from "../../../core/services";
import { config } from "../../../config";
import type {
  PushNotificationToken,
  NotificationPermissionStatus,
} from "../types";

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class PushNotificationsService extends BaseService {
  constructor() {
    super();
  }

  // Request notification permissions
  async requestPermission(): Promise<NotificationPermissionStatus> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const canAskAgain = finalStatus === "undetermined";

    return {
      status: finalStatus as "granted" | "denied" | "undetermined",
      canAskAgain,
    };
  }

  // Get push notification token
  async getExpoPushToken(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log("Must use physical device for Push Notifications");
      return null;
    }

    const { status } = await this.requestPermission();

    if (status !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: config.expo?.projectId,
      })
    ).data;

    // Android-specific channel configuration
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  // Register device token with backend
  async registerToken(userId: string, token: string): Promise<void> {
    const platform = Platform.OS as "ios" | "android";

    await this.post("/api/push/register", {
      user_id: userId,
      token,
      platform,
    });
  }

  // Unregister device token
  async unregisterToken(userId: string, token: string): Promise<void> {
    await this.post("/api/push/unregister", {
      user_id: userId,
      token,
    });
  }

  // Schedule a local notification (for testing)
  async scheduleLocalNotification(
    title: string,
    body: string,
    seconds: number = 0
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: seconds > 0 ? { seconds } : null,
    });

    return notificationId;
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Add notification received listener
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Add notification response listener (when user taps notification)
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}
