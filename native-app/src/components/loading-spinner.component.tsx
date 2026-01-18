import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../core/theme";
import { ThemedText } from "./themed-text.component";
import { TextStyle } from "../core/styles/text";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = "large",
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
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
    padding: 20,
  },
  message: {
    marginTop: 12,
    textAlign: "center",
  },
});
