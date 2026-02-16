import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../types";
import { Routes } from "../routes";
import { useTheme } from "../../core/theme";
import { DashboardScreen } from "../../screens/dashboard/dashboard.screen";
import { LeaguesNavigator } from "../leagues/leagues.navigator";
import { ProfileScreen } from "../../screens/profile/profile.screen";
import { StatsScreen } from "../../screens/stats/stats.screen";
import { AboutScreen } from "../../screens/info/about.screen";
import { Icon } from "../../icons/icon.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InjectableType } from "../../di/di";
import { useInjection } from "../../di/di";
import { PushNotificationsService } from "../../features/push-notifications/services";
import { useAuthState } from "../../features/auth/state";

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => {
  const { theme } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { user } = useAuthState();
  useEffect(() => {
    if (!user) return;

    const pushNotificationService = useInjection<PushNotificationsService>(
      InjectableType.PUSH_NOTIFICATIONS
    );

    pushNotificationService.requestPermission(user.id);
    // async function initFCM() {
    //   await Notifications.requestPermissionsAsync();
    //   const messaging = getMessaging();
    //   const authStatus = await messaging.requestPermission();
    //   const enabled =
    //     authStatus === AuthorizationStatus.AUTHORIZED ||
    //     authStatus === AuthorizationStatus.PROVISIONAL;

    //   if (enabled) {
    //     const token = await messaging.getToken();
    //     console.log("FCM TOKEN:", token);
    //   }
    // }

    // initFCM();
  }, [user]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text + "80", // 50% opacity
        tabBarStyle: {
          backgroundColor: theme.navigationBarBackground,
          boxShadow: `0 0 10px 0 ${theme.colors.border}`,
          height: bottom + 60,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name={Routes.Home}
        component={DashboardScreen}
        options={{
          tabBarLabel: "Home",
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.Leagues}
        component={LeaguesNavigator}
        options={{
          tabBarLabel: "Leagues",
          title: "Leagues",
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" color={color} size={size} />
          ),
          headerShown: false,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const leaguesRoute = state.routes.find(
              (r) => r.name === Routes.Leagues
            );

            if (
              leaguesRoute?.state?.index !== undefined &&
              leaguesRoute.state.index > 0
            ) {
              e.preventDefault();
              navigation.navigate(Routes.Leagues, {
                screen: Routes.BrowseLeagues,
              });
            }
          },
        })}
      />
      <Tab.Screen
        name={Routes.Stats}
        component={StatsScreen}
        options={{
          tabBarLabel: "Stats",
          title: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
