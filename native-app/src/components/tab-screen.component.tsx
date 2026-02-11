import React from "react";
import { View, StyleSheet } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";

import { useTheme } from "../core/theme";
import {
  defaultIconSize,
  rounding,
  roundingMedium,
  roundingSmall,
  shadow,
} from "../core/styles/global";
import { Icon } from "../icons/icon.component";
import { GlobalTextStyles, TextStyle } from "../core/styles/text";
import { IconName } from "../icons";
import { TobBar } from "./top-bar.component";
import { LinearGradient } from "expo-linear-gradient";
import { Container } from "./container.component";

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
}: TabScreenProps) => {
  const { theme } = useTheme();

  const tabBarOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: {
      borderTopLeftRadius: roundingMedium,
      borderTopRightRadius: roundingMedium,
      backgroundColor: theme.colors.cardGradient[0],
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tabBarItemStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    tabBarIndicatorStyle: {
      backgroundColor: theme.colors.primary,
      height: 1,
    },
    tabBarLabelStyle: {
      ...GlobalTextStyles[TextStyle.BodyMedium],
    },
    tabBarContentContainerStyle: {
      width: "100%",
    },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.muted,
    tabBarPressColor: theme.colors.primary + "20",
    tabBarScrollEnabled: tabs.length > 3,
  };

  const renderComponent = (component: React.ReactNode) => {
    return () => (
      <LinearGradient
        colors={theme.colors.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {component}
      </LinearGradient>
    );
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
          lazy: true,
          lazyPreloadDistance: 0,
        }}
      >
        {tabs.map((tab) => (
          <TabNavigator.Screen
            key={tab.name}
            name={tab.name}
            component={renderComponent(tab.component)}
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
