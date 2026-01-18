import { create } from "zustand";
import type { Membership, LeagueMember } from "../types";
import { membershipService } from "../../../di/services.registry";

export interface MembershipState {
  membersByLeague: Record<string, LeagueMember[]>;
  isMember: boolean;
  membership: Membership | null;
  loading: boolean;
  error: string | null;

  // Actions
  checkMembership: (leagueId: string, userId: string) => Promise<void>;
  joinLeague: (leagueId: string, userId: string) => Promise<void>;
  fetchMembersByLeagueId: (leagueId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useMembershipState = create<MembershipState>((set, get) => {

  return {
    membersByLeague: {},
    isMember: false,
    membership: null,
    loading: false,
    error: null,

    checkMembership: async (leagueId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
        const result = await membershipService.checkMembership(Number(leagueId), userId);
        set({
          isMember: result.isMember,
          membership: result.membership,
          loading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to check membership",
          loading: false,
        });
      }
    },

    joinLeague: async (leagueId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
        const result = await membershipService.joinLeague(Number(leagueId), userId);
        set({
          membership: result.membership,
          isMember: true,
          loading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to join league",
          loading: false,
        });
        throw error;
      }
    },

    fetchMembersByLeagueId: async (leagueId: string) => {
      set({ loading: true, error: null });
      try {
        const members = await membershipService.getLeagueMembers(Number(leagueId));
        set({ membersByLeague: { ...get().membersByLeague, [leagueId]: members }, loading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch members",
          loading: false,
        });
      }
    },

    clearError: () => set({ error: null }),

    reset: () =>
      set({
        isMember: false,
        membersByLeague: {},
        loading: false,
        error: null,
      }),
  };
});
