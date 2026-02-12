import React from "react";
import { View, StyleSheet } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";

import { useTheme } from "../core/theme";
import { defaultIconSize, padding } from "../core/styles/global";
import { Icon } from "../icons/icon.component";
import { GlobalTextStyles, TextStyle } from "../core/styles/text";
import { IconName } from "../icons";
import { TobBar } from "./top-bar.component";

export interface TabConfig {
  name: string;
  component: React.ReactNode;
  icon?: IconName;
  label?: string;
  options?: MaterialTopTabNavigationOptions;
}

export interface TabScreenProps {
  tabs: TabConfig[];
  headerComponent?: React.ReactNode;
  tabBarPosition?: "top" | "bottom";
  initialRouteName?: string;
  alignTabsToLeft?: boolean;
  showBottomBorder?: boolean;
  options?: MaterialTopTabNavigationOptions;
}

const TabNavigator = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

export const TabScreen = ({
  tabs,
  headerComponent,
  tabBarPosition = "top",
  initialRouteName,
  alignTabsToLeft = false,
  showBottomBorder = true,
  options,
}: TabScreenProps) => {
  const { theme } = useTheme();

  const tabBarOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: {
      backgroundColor: "transparent",
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: showBottomBorder ? 1 : 0,
      borderBottomColor: theme.colors.border,
      ...(alignTabsToLeft && {
        width: "auto",
      }),
    },
    tabBarItemStyle: {
      alignItems: "center",
      justifyContent: "center",
      ...(alignTabsToLeft && {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "auto",
      }),
    },
    tabBarIndicatorStyle: {
      backgroundColor: theme.colors.primary,
      height: 3,
      borderRadius: 2,
    },
    tabBarLabelStyle: {
      ...GlobalTextStyles[TextStyle.BodyMedium],
    },
    tabBarContentContainerStyle: {
      ...(alignTabsToLeft && {
        width: "auto",
        alignSelf: "flex-start",
      }),
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.muted,
    tabBarPressColor: theme.colors.primary + "20",
    ...(alignTabsToLeft && {
      tabBarScrollEnabled: true,
    }),
  };

  return (
    <View style={styles.container}>
      {headerComponent && (
        <TobBar showBackButton={true} children={headerComponent} />
      )}

      <TabNavigator.Navigator
        initialRouteName={initialRouteName}
        tabBarPosition={tabBarPosition}
        screenOptions={{
          ...tabBarOptions,
          ...options,
          lazy: true,
          lazyPreloadDistance: 0,
        }}
      >
        {tabs.map((tab) => (
          <TabNavigator.Screen
            key={tab.name}
            name={tab.name}
            children={({ route }) => tab.component}
            options={{
              tabBarLabel: tab.label ?? tab.name,
              ...tab.options,
              tabBarIcon: tab.icon
                ? ({ focused }) => (
                    <Icon
                      name={tab.icon!}
                      size={defaultIconSize}
                      color={
                        focused ? theme.colors.primary : theme.colors.muted
                      }
                    />
                  )
                : undefined,
            }}
          />
        ))}
      </TabNavigator.Navigator>
    </View>
  );
};
