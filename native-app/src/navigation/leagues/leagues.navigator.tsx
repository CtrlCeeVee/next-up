import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LeaguesStackParamList } from "../types";
import { Routes } from "../routes";
import { BrowseLeaguesScreen, LeagueDetailScreen } from "../../screens/leagues";
import { LeagueNightScreen } from "../../screens/league-night/league-night.screen";
import { useTheme } from "../../core/theme";

const Stack = createNativeStackNavigator<LeaguesStackParamList>();

export const LeaguesNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={Routes.BrowseLeagues}
    >
      <Stack.Screen
        name={Routes.BrowseLeagues}
        component={BrowseLeaguesScreen}
        options={{
          title: "Leagues",
        }}
      />
      <Stack.Screen
        name={Routes.LeagueDetail}
        component={LeagueDetailScreen}
        options={{
          title: "League Detail",
        }}
      />
      <Stack.Screen
        name={Routes.LeagueNight}
        component={LeagueNightScreen}
        options={({ route }) => ({
          title: "League Night",
          headerBackTitle: "Back",
        })}
      />
    </Stack.Navigator>
  );
};
