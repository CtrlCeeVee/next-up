import * as Notifications from "expo-notifications";

import React, { useEffect } from "react";
import { ThemeProvider } from "../core/theme";
import { Screen } from "./screen";
import { useToastState } from "../features/toast/state/toast.state";
import Constants from "expo-constants";
import { ExecutionEnvironment } from "expo-constants";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const isExpoGo = () =>
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (!isExpoGo()) {
  import("@react-native-firebase/messaging")
    .then(({ onMessage, getMessaging, setBackgroundMessageHandler }) => {
      const messaging = getMessaging();
      onMessage(messaging, async (remoteMessage) => {
        Notifications.scheduleNotificationAsync({
          content: {
            title:
              remoteMessage.notification?.title ||
              remoteMessage.data?.title.toString() ||
              "",
            body:
              remoteMessage.notification?.body ||
              remoteMessage.data?.body.toString() ||
              "",
          },
          trigger: null,
        });
      });
      setBackgroundMessageHandler(messaging, async (remoteMessage) => {
        Notifications.scheduleNotificationAsync({
          content: {
            title:
              remoteMessage.notification?.title ||
              remoteMessage.data?.title.toString() ||
              "",
            body:
              remoteMessage.notification?.body ||
              remoteMessage.data?.body.toString() ||
              "",
          },
          trigger: null,
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

export const App = () => {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
};
