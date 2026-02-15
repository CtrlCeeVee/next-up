import { create } from "zustand";

export interface LeaguesState {
  currentLeagueId: string | null;
  setCurrentLeagueId: (leagueId: string) => void;
  reset: () => void;
}
export const useLeaguesState = create<LeaguesState>((set) => {
  return {
    currentLeagueId: null,
    setCurrentLeagueId: (leagueId: string) =>
      set({ currentLeagueId: leagueId }),
    reset: () => set({ currentLeagueId: null }),
  };
});
