import React, { createRef } from "react";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamList } from "./types";
import { RootNavigator } from "./root.navigator";
import { useTheme } from "../core/theme";
import { linking } from "./linking";

// Create navigation ref for imperative navigation
export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export const NavigationProvider = () => {
  const { theme } = useTheme();

  // Make navigation theme transparent so app theme shows through
  const navigationTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: "transparent",
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      linking={linking}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

// Export navigation utilities
export * from "./routes";
export * from "./types";
