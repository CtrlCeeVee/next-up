import { create } from "zustand";
import type { Membership, LeagueMember } from "../types";
import { membershipService } from "../../../di/services.registry";

export interface MembershipState {
  membersByLeague: Record<string, LeagueMember[]>;
  memberships: Record<string, Membership | null>; // Store memberships by leagueId
  loading: boolean;
  joining: boolean;
  leaving: boolean;
  error: string | null;

  // Actions
  getMemberships: (userId: string) => Promise<void>;
  isMember: (leagueId: string) => boolean;
  checkMembership: (leagueId: string, userId: string) => Promise<void>;
  fetchMembership: (leagueId: string, userId: string) => Promise<void>;
  joinLeague: (leagueId: string, userId: string) => Promise<void>;
  leaveLeague: (leagueId: string, userId: string) => Promise<void>;
  fetchMembersByLeagueId: (leagueId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useMembershipState = create<MembershipState>((set, get) => {
  return {
    membersByLeague: {},
    memberships: {},
    loading: false,
    joining: false,
    leaving: false,
    error: null,

    getMemberships: async (userId: string) => {
      const memberships = await membershipService.getAll(userId);
      set({
        memberships: memberships.reduce(
          (acc, membership) => ({
            ...acc,
            [membership.league_id]: membership,
          }),
          {}
        ),
      });
    },

    isMember: (leagueId: string) => {
      const membership = get().memberships[leagueId.toString()];
      return !!membership;
    },

    checkMembership: async (leagueId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
        const result = await membershipService.checkMembership(
          leagueId,
          userId
        );
        set({
          memberships: {
            ...get().memberships,
            [leagueId]: result.membership,
          },
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

    fetchMembership: async (leagueId: string, userId: string) => {
      set({ loading: true, error: null });
      try {
        const result = await membershipService.checkMembership(
          leagueId,
          userId
        );
        set({
          memberships: {
            ...get().memberships,
            [leagueId.toString()]: result.membership,
          },
          loading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch membership",
          loading: false,
        });
      }
    },

    joinLeague: async (leagueId: string, userId: string) => {
      set({ joining: true, error: null });
      try {
        const result = await membershipService.joinLeague(leagueId, userId);
        set({
          memberships: {
            ...get().memberships,
            [leagueId.toString()]: result.membership,
          },
          joining: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to join league",
          joining: false,
        });
        throw error;
      }
    },

    leaveLeague: async (leagueId: string, userId: string) => {
      set({ leaving: true, error: null });
      try {
        await membershipService.leaveLeague(leagueId, userId);
        set({
          memberships: {
            ...get().memberships,
            [leagueId.toString()]: null,
          },
          leaving: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to leave league",
          leaving: false,
        });
        throw error;
      }
    },

    fetchMembersByLeagueId: async (leagueId: string) => {
      set({ loading: true, error: null });
      try {
        const members = await membershipService.getLeagueMembers(leagueId);
        set({
          membersByLeague: { ...get().membersByLeague, [leagueId]: members },
          loading: false,
        });
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
        membersByLeague: {},
        memberships: {},
        loading: false,
        joining: false,
        leaving: false,
        error: null,
      }),
  };
});
