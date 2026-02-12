import { create } from "zustand";
import { leagueNightsService } from "../../../di/services.registry";
import type {
  LeagueNightInstance,
  CheckedInPlayer,
  PartnershipRequest,
  ConfirmedPartnership,
} from "../types";

interface LeagueNightState {
  // Data
  leagueNightInstance: LeagueNightInstance | null;
  nextUpLeagueNightInstances: LeagueNightInstance[];
  checkedInPlayers: CheckedInPlayer[];
  sentRequests: PartnershipRequest[];
  receivedRequests: PartnershipRequest[];
  confirmedPartnership: ConfirmedPartnership | null;
  currentMatch: any | null;

  // Loading states
  loading: boolean;
  checkingIn: boolean;
  unchecking: boolean;
  sendingRequest: string | null;
  acceptingRequest: string | null;
  rejectingRequest: string | null;
  removingPartnership: boolean;
  startingLeague: boolean;
  endingLeague: boolean;
  loadingPartnershipData: boolean;

  // Error state
  error: string | null;

  // Actions
  fetchLeagueNight: (leagueId: string, nightId: string) => Promise<void>;
  fetchNextUpLeagueNightInstances: (
    count: number,
    userId: string
  ) => Promise<void>;
  refreshCheckedInPlayers: (leagueId: string, nightId: string) => Promise<void>;
  refreshPartnershipRequests: (
    leagueId: string,
    nightId: string,
    userId: string
  ) => Promise<void>;
  updatePartnershipRequest: (
    request: PartnershipRequest,
    userId: string
  ) => void;

  // Check-in actions
  checkInPlayer: (
    leagueId: string,
    nightId: string,
    userId: string
  ) => Promise<void>;
  uncheckPlayer: (
    leagueId: string,
    nightId: string,
    userId: string
  ) => Promise<void>;

  // Partnership actions
  sendPartnershipRequest: (
    leagueId: string,
    nightId: string,
    senderId: string,
    receiverId: string
  ) => Promise<void>;
  acceptPartnershipRequest: (
    leagueId: string,
    nightId: string,
    requestId: string,
    userId: string
  ) => Promise<void>;
  rejectPartnershipRequest: (
    leagueId: string,
    nightId: string,
    requestId: string,
    userId: string
  ) => Promise<void>;
  removePartnership: (
    leagueId: string,
    nightId: string,
    userId: string
  ) => Promise<void>;

  // Admin actions
  startLeague: (
    leagueId: string,
    nightId: string,
    userId: string
  ) => Promise<void>;
  endLeague: (
    leagueId: string,
    nightId: string,
    userId: string
  ) => Promise<void>;

  // Utility
  clearError: () => void;
  reset: () => void;
}

export const useLeagueNightState = create<LeagueNightState>((set, get) => ({
  // Initial state
  leagueNightInstance: null,
  nextUpLeagueNightInstances: [],
  checkedInPlayers: [],
  sentRequests: [],
  receivedRequests: [],
  confirmedPartnership: null,
  currentMatch: null,
  loading: false,
  checkingIn: false,
  unchecking: false,
  sendingRequest: null,
  acceptingRequest: null,
  rejectingRequest: null,
  removingPartnership: false,
  startingLeague: false,
  endingLeague: false,
  loadingPartnershipData: false,
  error: null,

  // Fetch league night
  fetchLeagueNight: async (leagueId: string, nightId: string) => {
    set({ loading: true, error: null });
    try {
      const leagueNightInstance = await leagueNightsService.getLeagueNight(
        leagueId,
        nightId
      );
      set({
        leagueNightInstance: leagueNightInstance,
        checkedInPlayers: leagueNightInstance.checkins,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch league night",
        loading: false,
      });
    }
  },

  // Fetch next up league night instances
  fetchNextUpLeagueNightInstances: async (count: number, userId: string) => {
    set({ loading: true, error: null });
    try {
      const nextUpLeagueNightInstances =
        await leagueNightsService.getNextUpLeagueNightInstances(count, userId);
      set({ nextUpLeagueNightInstances });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch next up league night instances",
        loading: false,
      });
    }
  },

  // Refresh checked-in players
  refreshCheckedInPlayers: async (leagueId: string, nightId: string) => {
    try {
      const players = await leagueNightsService.getCheckedInPlayers(
        leagueId,
        nightId
      );
      set({ checkedInPlayers: players });
    } catch (error) {
      console.error("Error refreshing checked-in players:", error);
    }
  },

  // Refresh partnership requests
  refreshPartnershipRequests: async (
    leagueId: string,
    nightId: string,
    userId: string
  ) => {
    set({ loadingPartnershipData: true, error: null });
    try {
      const requests = await leagueNightsService.getPartnershipRequests(
        leagueId,
        nightId,
        userId
      );
      set({ sentRequests: requests.sentRequests });
      set({ receivedRequests: requests.receivedRequests });
      set({ confirmedPartnership: requests.confirmedPartnership });
    } catch (error) {
      console.error("Error refreshing partnership requests:", error);
    }
    set({ loadingPartnershipData: false });
  },

  updatePartnershipRequest: (request: PartnershipRequest, userId: string) => {
    if (request.leagueNightInstanceId !== get().leagueNightInstance?.id) return;

    if (request.requester.id === userId) {
      set({ sentRequests: [...get().sentRequests, request] });
    } else {
      set({ receivedRequests: [...get().receivedRequests, request] });
    }
  },

  // Check in player
  checkInPlayer: async (leagueId: string, nightId: string, userId: string) => {
    set({ checkingIn: true, error: null });
    try {
      await leagueNightsService.checkInPlayer(leagueId, nightId, userId);
      await get().refreshCheckedInPlayers(leagueId, nightId);
      await get().refreshPartnershipRequests(leagueId, nightId, userId);
      set({ checkingIn: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to check in",
        checkingIn: false,
      });
      throw error;
    }
  },

  // Uncheck player
  uncheckPlayer: async (leagueId: string, nightId: string, userId: string) => {
    set({ unchecking: true, error: null });
    try {
      await leagueNightsService.uncheckPlayer(leagueId, nightId, userId);
      await get().refreshCheckedInPlayers(leagueId, nightId);
      await get().refreshPartnershipRequests(leagueId, nightId, userId);
      set({ unchecking: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to uncheck",
        unchecking: false,
      });
      throw error;
    }
  },

  // Send partnership request
  sendPartnershipRequest: async (
    leagueId: string,
    nightId: string,
    senderId: string,
    receiverId: string
  ) => {
    set({ sendingRequest: receiverId, error: null });
    try {
      const request = await leagueNightsService.sendPartnershipRequest(
        leagueId,
        nightId,
        senderId,
        receiverId
      );
      console.log("request", request);

      set({
        sentRequests: [...get().sentRequests, request],
        
        sendingRequest: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to send partnership request",
        sendingRequest: null,
      });
      throw error;
    }
  },

  // Accept partnership request
  acceptPartnershipRequest: async (
    leagueId: string,
    nightId: string,
    requestId: string,
    userId: string
  ) => {
    set({ acceptingRequest: requestId, error: null });
    try {
      await leagueNightsService.acceptPartnershipRequest(
        leagueId,
        nightId,
        requestId,
        userId
      );
      await get().refreshCheckedInPlayers(leagueId, nightId);
      await get().refreshPartnershipRequests(leagueId, nightId, userId);
      set({ acceptingRequest: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to accept partnership request",
        acceptingRequest: null,
      });
      throw error;
    }
  },

  // Reject partnership request
  rejectPartnershipRequest: async (
    leagueId: string,
    nightId: string,
    requestId: string,
    userId: string
  ) => {
    set({ rejectingRequest: requestId, error: null });
    try {
      await leagueNightsService.rejectPartnershipRequest(
        leagueId,
        nightId,
        requestId,
        userId
      );
      await get().refreshPartnershipRequests(leagueId, nightId, userId);
      set({ rejectingRequest: null });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to reject partnership request",
        rejectingRequest: null,
      });
      throw error;
    }
  },

  // Remove partnership
  removePartnership: async (
    leagueId: string,
    nightId: string,
    userId: string
  ) => {
    set({ removingPartnership: true, error: null });
    try {
      await leagueNightsService.removePartnership(leagueId, nightId, userId);
      await get().refreshCheckedInPlayers(leagueId, nightId);
      await get().refreshPartnershipRequests(leagueId, nightId, userId);
      set({ removingPartnership: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove partnership",
        removingPartnership: false,
      });
      throw error;
    }
  },

  // Start league (admin)
  startLeague: async (leagueId: string, nightId: string, userId: string) => {
    set({ startingLeague: true, error: null });
    try {
      await leagueNightsService.startLeague(leagueId, nightId, userId);
      await get().fetchLeagueNight(leagueId, nightId);
      set({ startingLeague: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to start league",
        startingLeague: false,
      });
      throw error;
    }
  },

  // End league (admin)
  endLeague: async (leagueId: string, nightId: string, userId: string) => {
    set({ endingLeague: true, error: null });
    try {
      await leagueNightsService.endLeague(leagueId, nightId, userId);
      await get().fetchLeagueNight(leagueId, nightId);
      set({ endingLeague: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to end league",
        endingLeague: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset state
  reset: () =>
    set({
      leagueNightInstance: null,
      checkedInPlayers: [],
      sentRequests: [],
      receivedRequests: [],
      confirmedPartnership: null,
      currentMatch: null,
      loading: false,
      checkingIn: false,
      unchecking: false,
      sendingRequest: null,
      acceptingRequest: null,
      rejectingRequest: null,
      removingPartnership: false,
      startingLeague: false,
      endingLeague: false,
      loadingPartnershipData: false,
      error: null,
    }),
}));
