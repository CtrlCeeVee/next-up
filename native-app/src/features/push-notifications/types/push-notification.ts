export interface PushNotificationToken {
  token: string;
  platform: "ios" | "android";
}

export interface NotificationPermissionStatus {
  status: "granted" | "denied" | "undetermined";
  canAskAgain: boolean;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}
