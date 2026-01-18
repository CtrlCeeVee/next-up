import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { ThemedText } from "./themed-text.component";
import { Icon } from "../icons";
import { useTheme } from "../core/theme";

interface RealtimeStatusIndicatorProps {
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  style?: any;
}

/**
 * Visual indicator for real-time connection status
 * Shows a small badge with connection state
 */
export const RealtimeStatusIndicator: React.FC<
  RealtimeStatusIndicatorProps
> = ({ isConnected, connectionStatus, style }) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for connecting state
  useEffect(() => {
    if (connectionStatus === "connecting") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [connectionStatus, pulseAnim]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return theme.colors.success;
      case "connecting":
        return "#F59E0B";
      case "error":
        return theme.colors.error;
      case "disconnected":
      default:
        return theme.colors.text + "40";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Live";
      case "connecting":
        return "Connecting...";
      case "error":
        return "Connection Error";
      case "disconnected":
      default:
        return "Disconnected";
    }
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: statusColor,
            opacity: pulseAnim,
          },
        ]}
      />
      <ThemedText
        styleType="BodySmall"
        style={[styles.text, { color: statusColor }]}
      >
        {getStatusText()}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontWeight: "600",
  },
});
