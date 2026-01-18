import { create } from "zustand";
import type { ProfileData, UpdateProfileData, PlayerStreaks, PlayerStats } from "../types";
import { profilesService } from "../../../di/services.registry";

export interface ProfilesState {
  profile: ProfileData | null;
  streaks: PlayerStreaks | null;
  stats: PlayerStats | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchProfileByUsername: (username: string) => Promise<void>;
  fetchProfileByUserId: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: UpdateProfileData) => Promise<void>;
  fetchStreaks: (userId: string) => Promise<void>;
  fetchStats: (userId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useProfilesState = create<ProfilesState>((set, get) => {

  return {
    profile: null,
    streaks: null,
    stats: null,
    loading: false,
    error: null,

    fetchProfileByUsername: async (username: string) => {
      set({ loading: true, error: null });
      try {
        const profile = await profilesService.getProfileByUsername(username);
        set({ profile: profile, loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch profile",
          loading: false,
        });
      }
    },

    fetchProfileByUserId: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const profile = await profilesService.getProfileByUserId(userId);
        set({ profile: profile, loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch profile",
          loading: false,
        });
      }
    },

    updateProfile: async (userId: string, data: UpdateProfileData) => {
      set({ loading: true, error: null });
      try {
        const profile = await profilesService.updateProfile(userId, data);
        set({ profile: profile, loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to update profile",
          loading: false,
        });
        throw error;
      }
    },

    fetchStreaks: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const streaks = await profilesService.getPlayerStreaks(userId);
        set({ streaks, loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch streaks",
          loading: false,
        });
      }
    },

    fetchStats: async (userId: string) => {
      set({ loading: true, error: null });
      try {
        const stats = await profilesService.getPlayerStats(userId);
        set({ stats, loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch stats",
          loading: false,
        });
      }
    },

    clearError: () => set({ error: null }),

    reset: () =>
      set({
        profile: null,
        streaks: null,
        stats: null,
        loading: false,
        error: null,
      }),
  };
});
