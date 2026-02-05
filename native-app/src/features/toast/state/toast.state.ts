import { create } from "zustand";
import { Toast, ToastInput } from "../types";

interface ToastState {
  toasts: Toast[];
  showToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

/**
 * Toast notification store
 * Manages toast notifications with auto-dismiss
 */
export const useToastState = create<ToastState>((set, get) => ({
  toasts: [],

  showToast: (toast: ToastInput) => {
    console.log("showToast", toast);
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 4000, // Default 4 seconds
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },
}));
