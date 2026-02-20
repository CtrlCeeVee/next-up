import { create } from "zustand";
import { getService, InjectableType } from "../../../di";
import { LeaguesService } from "../services";

const leaguesService = getService<LeaguesService>(InjectableType.LEAGUES);

export interface LeaguesState {
  currentLeagueId: string | null;
  setCurrentLeagueId: (leagueId: string) => void;
  reset: () => void;

  favouriteLeagueIds: string[];
  fetchFavouriteLeagueIds: (userId: string) => Promise<void>;
  favouriteLeague: (leagueId: string, userId: string) => Promise<void>;
  unfavouriteLeague: (leagueId: string, userId: string) => Promise<void>;
}
export const useLeaguesState = create<LeaguesState>((set, get) => {
  return {
    currentLeagueId: null,
    setCurrentLeagueId: (leagueId: string) =>
      set({ currentLeagueId: leagueId }),
    reset: () => set({ currentLeagueId: null }),
    favouriteLeagueIds: [],
    fetchFavouriteLeagueIds: async (userId: string) => {
      const favouriteLeagueIds =
        await leaguesService.getFavouriteLeagueIds(userId);
      set({ favouriteLeagueIds });
    },
    favouriteLeague: async (leagueId: string, userId: string) => {
      await leaguesService.favouriteLeague(leagueId, userId);
      const currentFavouriteLeagueIds = get().favouriteLeagueIds;
      set({ favouriteLeagueIds: [...currentFavouriteLeagueIds, leagueId] });
    },
    unfavouriteLeague: async (leagueId: string, userId: string) => {
      await leaguesService.unfavouriteLeague(leagueId, userId);
      const currentFavouriteLeagueIds = get().favouriteLeagueIds;
      set({
        favouriteLeagueIds: currentFavouriteLeagueIds.filter(
          (id) => id !== leagueId
        ),
      });
    },
  };
});
