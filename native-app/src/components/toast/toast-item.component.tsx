import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { ThemedText } from "../themed-text.component";
import { Icon, IconName } from "../../icons";
import { useTheme } from "../../core/theme";
import { Toast, ToastType } from "../../features/toast/types";
import { TextStyle } from "../../core/styles";
import { AppThemeCoreColours, ThemeCoreColours } from "../../core/theme/theme";
import { spacing, gap, roundingLarge } from "../../core/styles/global";

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const getToastIcon = (type: ToastType): IconName => {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "alert-circle";
    case "warning":
      return "alert-triangle";
    case "info":
    default:
      return "info";
  }
};

const getToastColors = (type: ToastType, theme: AppThemeCoreColours) => {
  switch (type) {
    case "success":
      return {
        background: theme.colors.primary,
        border: theme.colors.notification,
        icon: theme.colors.notification,
        text: theme.colors.notification,
      };
    case "error":
      return {
        background: theme.colors.danger,
        border: theme.colors.notification,
        icon: theme.colors.notification,
        text: theme.colors.notification,
      };
    case "warning":
      return {
        background: theme.colors.primary,
        border: theme.colors.notification,
        icon: theme.colors.notification,
        text: theme.colors.notification,
      };
    case "info":
    default:
      return {
        background: theme.colors.primary,
        border: theme.colors.notification,
        icon: theme.colors.notification,
        text: theme.colors.notification,
      };
  }
};

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { theme } = useTheme();
  const colors = getToastColors(toast.type, theme);
  const icon = getToastIcon(toast.type);

  const translateX = useRef(new Animated.Value(Dimensions.get("window").width)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: Dimensions.get("window").width,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderLeftColor: colors.border,
          transform: [{ translateX }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Icon name={icon} size={20} color={colors.icon} />
        <View style={styles.textContainer}>
          <ThemedText
            textStyle={TextStyle.BodyMedium}
            style={[styles.title, { color: colors.text }]}
          >
            {toast.title}
          </ThemedText>
          {toast.message && (
            <ThemedText
              textStyle={TextStyle.BodySmall}
              style={[styles.message, { color: colors.text }]}
            >
              {toast.message}
            </ThemedText>
          )}
        </View>
        <TouchableOpacity
          onPress={handleDismiss}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="close" size={16} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: roundingLarge,
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.lg,
    gap: gap.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
  },
  message: {
    marginTop: spacing.xs,
    opacity: 0.9,
  },
  closeButton: {
    padding: spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
});
