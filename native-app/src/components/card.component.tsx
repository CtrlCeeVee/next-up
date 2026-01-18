import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../core/theme";
import { rounding, padding, shadow } from "../core/styles/global";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "soft" | "elevated";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
}) => {
  const { theme } = useTheme();

  const getShadowStyle = () => {
    switch (variant) {
      case "soft":
        return shadow.soft;
      case "elevated":
        return shadow.medium;
      default:
        return {};
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
        },
        getShadowStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: rounding,
    padding: padding,
  },
});
