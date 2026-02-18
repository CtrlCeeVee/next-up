import * as Notifications from "expo-notifications";

import React, { useEffect } from "react";
import { ThemeProvider } from "../core/theme";
import { Screen } from "./screen";
import { useToastState } from "../features/toast/state/toast.state";
import Constants from "expo-constants";
import { ExecutionEnvironment } from "expo-constants";
import { useLeagueNightState } from "../features/league-nights/state";
import { useAuthState } from "../features/auth/state";
import { getService, InjectableType, useInjection } from "../di/di";
import { WebsocketsService } from "../features/websockets/services/websockets.service";
import { NativeRealtimeEventName } from "../features/websockets/types";

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
        console.log("remoteMessage", remoteMessage);
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
        console.log("background remoteMessage", remoteMessage);
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
  const websocketsService = getService<WebsocketsService>(
    InjectableType.WEBSOCKETS
  );

  useEffect(() => {
    websocketsService.connect();
    return () => {
      websocketsService.disconnect();
    };
  }, []);

  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
};
