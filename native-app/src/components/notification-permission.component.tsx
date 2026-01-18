import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ThemedText, Card, Button } from "./";
import { Icon } from "../icons";
import { useTheme } from "../core/theme";
import { GlobalStyles, padding } from "../core/styles";
import { usePushNotificationsState } from "../features/push-notifications/state";
import { useAuthState } from "../features/auth/state";

/**
 * NotificationPermissionCard
 * Manages push notification permissions and registration
 */
export const NotificationPermissionCard: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuthState();
  const {
    token,
    permissionStatus,
    loading,
    error,
    requestPermission,
    registerDevice,
    unregisterDevice,
    clearError,
  } = usePushNotificationsState();

  const [isRegistered, setIsRegistered] = useState(false);

  // Check if we have a token and permission
  const isEnabled = permissionStatus?.status === "granted" && !!token && isRegistered;

  // Auto-register device when we get a token and user is logged in
  useEffect(() => {
    if (token && user && permissionStatus?.status === "granted" && !isRegistered) {
      registerDevice(user.id).then(() => {
        setIsRegistered(true);
      });
    }
  }, [token, user, permissionStatus, isRegistered]);

  const handleEnable = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to enable notifications");
      return;
    }

    // First request permission
    await requestPermission();

    // Registration will happen automatically in useEffect above
  };

  const handleDisable = () => {
    if (!user || !token) return;

    Alert.alert(
      "Disable Notifications",
      "Are you sure you want to disable push notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Disable",
          style: "destructive",
          onPress: async () => {
            await unregisterDevice(user.id);
            setIsRegistered(false);
          },
        },
      ]
    );
  };

  const handleTestNotification = async () => {
    try {
      const { scheduleLocalNotification } = await import(
        "../features/push-notifications/services"
      );
      // This would need to be properly imported from the service
      Alert.alert(
        "Test Notification",
        "A test notification will be sent in 2 seconds"
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send test notification");
    }
  };

  // If permission was denied
  if (permissionStatus?.status === "denied") {
    return (
      <Card style={styles.card}>
        <View style={styles.header}>
          <Icon name="bell-outline" size={24} color={theme.colors.error} />
          <ThemedText styleType="Subheader">Notifications Blocked</ThemedText>
        </View>
        <ThemedText styleType="Body" style={styles.description}>
          You've blocked notifications for this app. To enable them, go to your device settings:
        </ThemedText>
        <View style={styles.steps}>
          <ThemedText styleType="BodySmall" style={styles.step}>
            1. Open Settings app
          </ThemedText>
          <ThemedText styleType="BodySmall" style={styles.step}>
            2. Find "Next Up" in the app list
          </ThemedText>
          <ThemedText styleType="BodySmall" style={styles.step}>
            3. Enable Notifications
          </ThemedText>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Icon
          name={isEnabled ? "bell" : "bell-outline"}
          size={24}
          color={isEnabled ? theme.colors.success : theme.colors.text + "60"}
        />
        <ThemedText styleType="Subheader">Push Notifications</ThemedText>
      </View>

      <ThemedText styleType="Body" style={styles.description}>
        Get notified when your match is ready, scores need confirmation, or you receive
        partnership requests
      </ThemedText>

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + "20" }]}>
          <Icon name="alert-circle" size={16} color={theme.colors.error} />
          <ThemedText
            styleType="BodySmall"
            style={[styles.errorText, { color: theme.colors.error }]}
          >
            {error}
          </ThemedText>
          <TouchableOpacity onPress={clearError}>
            <Icon name="close" size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isEnabled ? theme.colors.success : theme.colors.text + "40" },
          ]}
        />
        <ThemedText styleType="BodySmall" style={styles.statusText}>
          {isEnabled ? "Enabled" : "Disabled"}
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {isEnabled ? (
          <>
            <Button
              text="Test Notification"
              variant="secondary"
              size="small"
              onPress={handleTestNotification}
              disabled={loading}
              leftIcon="bell"
              style={styles.actionButton}
            />
            <Button
              text="Disable"
              variant="ghost"
              size="small"
              onPress={handleDisable}
              disabled={loading}
              leftIcon="bell-outline"
              style={styles.actionButton}
            />
          </>
        ) : (
          <Button
            text="Enable Notifications"
            onPress={handleEnable}
            loading={loading}
            disabled={loading}
            leftIcon="bell"
            style={styles.actionButton}
          />
        )}
      </View>

      {permissionStatus?.status === "undetermined" && !isEnabled && (
        <ThemedText styleType="BodySmall" style={styles.hint}>
          We'll ask for your permission when you tap Enable
        </ThemedText>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    ...GlobalStyles.padding,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  description: {
    opacity: 0.8,
    lineHeight: 20,
  },
  steps: {
    gap: 8,
    paddingLeft: 8,
  },
  step: {
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
  hint: {
    opacity: 0.6,
    fontStyle: "italic",
    textAlign: "center",
  },
});
