import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../core/theme";

export const SplashScreen = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    ></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dotContainer: {
    position: "absolute",
    width: 1,
    height: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 1,
    height: 1,
    borderRadius: 0.5,
  },
});
