import { create } from "zustand";
import type { User, Session } from "@supabase/supabase-js";
import type { SignUpData, SignInData } from "../types";
import { authService } from "../../../di/services.registry";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthState = create<AuthState>((set, get) => {
  // Set up auth state change listener
  try {
    authService.onAuthStateChange((_event, session) => {
      set({
        user: session?.user ?? null,
        session: session,
        isAuthenticated: !!session?.user,
        loading: false,
      });
    });
  } catch (error) {
    console.error("Failed to set up auth state change listener:", error);
  }

  return {
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    error: null,

    signIn: async (email: string, password: string) => {
      set({ loading: true, error: null });
      try {
        await authService.signIn({ email, password });
        // Auth state will be updated by the listener
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to sign in",
          loading: false,
        });
        throw error;
      }
    },

    signUp: async (data: SignUpData) => {
      set({ loading: true, error: null });
      try {
        await authService.signUp(data);
        // Auth state will be updated by the listener
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to sign up",
          loading: false,
        });
        throw error;
      }
    },

    signOut: async () => {
      set({ loading: true, error: null });
      try {
        await authService.signOut();
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          loading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to sign out",
          loading: false,
        });
        throw error;
      }
    },

    checkSession: async () => {
      set({ loading: true });
      try {
        const session = await authService.getSession();
        set({
          user: session?.user ?? null,
          session: session,
          isAuthenticated: !!session?.user,
          loading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to check session",
          loading: false,
        });
      }
    },

    requestPasswordReset: async (email: string) => {
      set({ loading: true, error: null });
      try {
        await authService.requestPasswordReset(email);
        set({ loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to request password reset",
          loading: false,
        });
        throw error;
      }
    },

    updatePassword: async (newPassword: string) => {
      set({ loading: true, error: null });
      try {
        await authService.updatePassword(newPassword);
        set({ loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to update password",
          loading: false,
        });
        throw error;
      }
    },

    clearError: () => set({ error: null }),
  };
});
