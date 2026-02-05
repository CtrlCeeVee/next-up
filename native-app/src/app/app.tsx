import * as Notifications from "expo-notifications";

import { onMessage, getMessaging } from "@react-native-firebase/messaging";

import React, { useEffect } from "react";
import { ThemeProvider } from "../core/theme";
import { Screen } from "./screen";
import { useToastState } from "../features/toast/state/toast.state";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

onMessage(getMessaging(), async (remoteMessage) => {
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

export const App = () => {
  return (
    <ThemeProvider>
      <Screen />
    </ThemeProvider>
  );
};
