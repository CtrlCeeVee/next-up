import { create } from "zustand";
import type { League, TopPlayer, LeagueStats } from "../types";
import { leaguesService } from "../../../di/services.registry";

export interface LeaguesState {
  leagues: League[];
  currentLeague: League | null;
  topPlayers: TopPlayer[];
  stats: LeagueStats | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchLeagues: () => Promise<void>;
  fetchLeague: (leagueId: number) => Promise<void>;
  fetchTopPlayers: (leagueId: string, userEmail: string) => Promise<void>;
  fetchStats: (leagueId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useLeaguesState = create<LeaguesState>((set, get) => {

  return {
    leagues: [],
    currentLeague: null,
    topPlayers: [],
    stats: null,
    loading: false,
    error: null,

    fetchLeagues: async () => {
      set({ loading: true, error: null });
      try {
        const leagues = await leaguesService.getAll();
        set({ leagues, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to fetch leagues",
          loading: false,
        });
      }
    },

    fetchLeague: async (leagueId: number) => {
      set({ loading: true, error: null });
      try {
        const league = await leaguesService.getById(leagueId);
        set({ currentLeague: league, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to fetch league",
          loading: false,
        });
      }
    },

    fetchTopPlayers: async (leagueId: string, userEmail: string) => {
      set({ loading: true, error: null });
      try {
        const players = await leaguesService.getTopPlayers(leagueId);
        const playersWithCurrentUser = players.map((player) => ({
          ...player,
          isCurrentUser: player.email === userEmail,
        }));
        set({ topPlayers: playersWithCurrentUser, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to fetch top players",
          loading: false,
        });
      }
    },

    fetchStats: async (leagueId: string) => {
      set({ loading: true, error: null });
      try {
        const stats = await leaguesService.getStats(leagueId);
        set({ stats, loading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Failed to fetch stats",
          loading: false,
        });
      }
    },

    clearError: () => set({ error: null }),

    reset: () =>
      set({
        leagues: [],
        currentLeague: null,
        topPlayers: [],
        stats: null,
        loading: false,
        error: null,
      }),
  };
});
