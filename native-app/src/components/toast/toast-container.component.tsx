import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastState } from "../../features/toast/state";
import { ToastItem } from "./toast-item.component";
import { useTheme } from "../../core/theme";

/**
 * Toast container - displays all active toast notifications
 * Should be placed at the root of the app (in App.tsx or similar)
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastState();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          top: insets.top + (Platform.OS === "android" ? 8 : 0),
        },
      ]}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
});
