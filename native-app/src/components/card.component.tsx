import React from "react";
import { View, StyleSheet, ViewStyle, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../core/theme";
import { rounding, padding, shadow } from "../core/styles/global";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "soft" | "elevated";
  linearGradientColors?: [ColorValue, ColorValue];
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  linearGradientColors,
}) => {
  const { theme, isDark } = useTheme();

  const gradientColors: [ColorValue, ColorValue] =
    linearGradientColors || theme.colors.cardGradient;
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { borderColor: theme.colors.border }, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: rounding,
  },
  gradient: {
    borderRadius: rounding,
    width: "100%",
    padding: padding,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
});
