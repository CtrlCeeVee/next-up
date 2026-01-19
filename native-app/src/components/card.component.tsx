import React from "react";
import { View, StyleSheet, ViewStyle, ColorValue } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../core/theme";
import { rounding, padding, shadow } from "../core/styles/global";

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

  const getShadowStyle = () => {
    switch (variant) {
      case "soft":
        return shadow.soft;
      case "elevated":
        return shadow.medium;
      default:
        return shadow.soft; // Add subtle shadow by default
    }
  };

  // Glass morphism effect: semi-transparent with subtle gradient
  const gradientColors: [ColorValue, ColorValue] =
    linearGradientColors ||
    (isDark
      ? ["rgba(39, 42, 58, 0.8)", "rgba(30, 41, 59, 0.8)"] // slate-800/80 with slight gradient
      : ["rgba(255, 255, 255, 0.9)", "rgba(248, 250, 252, 0.85)"]); // white to slate-50 with transparency

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradient,
        { borderColor: theme.colors.border },
        getShadowStyle(),
        style,
      ]}
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
  },
});
