import { create } from "zustand";

interface LeagueNightState {
  currentLeagueNightInstanceId: string | null;
  setCurrentLeagueNightInstanceId: (leagueNightInstanceId: string) => void;
  reset: () => void;
}

export const useLeagueNightState = create<LeagueNightState>((set) => ({
  currentLeagueNightInstanceId: null,
  setCurrentLeagueNightInstanceId: (leagueNightInstanceId: string) =>
    set({ currentLeagueNightInstanceId: leagueNightInstanceId }),
  reset: () =>
    set({
      currentLeagueNightInstanceId: null,
    }),
}));
