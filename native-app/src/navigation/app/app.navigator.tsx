import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppTabParamList } from "../types";
import { Routes } from "../routes";
import { useTheme } from "../../core/theme";
import { DashboardScreen } from "../../screens/dashboard/dashboard.screen";
import { BrowseLeaguesScreen } from "../../screens/leagues/browse-leagues.screen";
import { ProfileScreen } from "../../screens/profile/profile.screen";
import { StatsScreen } from "../../screens/stats/stats.screen";
import { AboutScreen } from "../../screens/info/about.screen";
import { Icon } from "../../icons/icon.component";

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text + "80", // 50% opacity
        tabBarStyle: {
          backgroundColor: theme.componentBackground,
          borderTopColor: theme.colors.border,
          paddingBottom: 8,
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
          tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Routes.Leagues}
        component={BrowseLeaguesScreen}
        options={{
          tabBarLabel: "Leagues",
          title: "Leagues",
          tabBarIcon: ({ color, size }) => <Icon name="tennis-ball" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Routes.Stats}
        component={StatsScreen}
        options={{
          tabBarLabel: "Stats",
          title: "Statistics",
          tabBarIcon: ({ color, size }) => <Icon name="bar-chart" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name={Routes.Profile}
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          title: "Profile",
          tabBarIcon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
