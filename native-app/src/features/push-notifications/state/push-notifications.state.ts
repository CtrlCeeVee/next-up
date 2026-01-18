import { create } from "zustand";
import type { NotificationPermissionStatus } from "../types";
import { pushNotificationsService } from "../../../di/services.registry";

export interface PushNotificationsState {
  token: string | null;
  permissionStatus: NotificationPermissionStatus | null;
  loading: boolean;
  error: string | null;

  // Actions
  requestPermission: () => Promise<void>;
  registerDevice: (userId: string) => Promise<void>;
  unregisterDevice: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const usePushNotificationsState = create<PushNotificationsState>(
  (set, get) => {

    return {
      token: null,
      permissionStatus: null,
      loading: false,
      error: null,

      requestPermission: async () => {
        set({ loading: true, error: null });
        try {
          const status = await pushNotificationsService.requestPermission();
          set({ permissionStatus: status, loading: false });

          if (status.status === "granted") {
            const token = await pushNotificationsService.getExpoPushToken();
            set({ token });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to request permission",
            loading: false,
          });
        }
      },

      registerDevice: async (userId: string) => {
        const { token } = get();
        if (!token) {
          set({ error: "No push token available" });
          return;
        }

        set({ loading: true, error: null });
        try {
          await pushNotificationsService.registerToken(userId, token);
          set({ loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to register device",
            loading: false,
          });
        }
      },

      unregisterDevice: async (userId: string) => {
        const { token } = get();
        if (!token) return;

        set({ loading: true, error: null });
        try {
          await pushNotificationsService.unregisterToken(userId, token);
          set({ token: null, loading: false });
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to unregister device",
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    };
  }
);
