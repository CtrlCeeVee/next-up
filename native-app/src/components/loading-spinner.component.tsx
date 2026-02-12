import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../core/theme";
import { ThemedText } from "./themed-text.component";
import { TextStyle, spacing } from "../core/styles";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  style?: ViewStyle;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = "large",
  style,
  color = undefined,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
      {message && (
        <ThemedText textStyle={TextStyle.Body} style={styles.message}>
          {message}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg + 4,
  },
  message: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
