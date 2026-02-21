import { BaseService } from "../../../core/services";
import type {
  LeagueNightInstance,
  CheckedInPlayer,
  PartnershipRequest,
  PartnershipRequestsResponse,
  ConfirmedPartnership,
  PartnershipRequestResponse,
  Match,
  GetMatchesResponse,
  GetMatchResponse,
  MatchScoreResponse,
} from "../types";
import {
  GetCheckedInPlayersResponse,
  GetLeagueNightsResponse,
} from "./responses";

export class LeagueNightsService extends BaseService {
  constructor() {
    super();
  }

  // Get all league  nights details
  async getAllLeagueNights(leagueId: string): Promise<GetLeagueNightsResponse> {
    const response = await this.get<any>(`/api/leagues/${leagueId}/nights`);
    return response.data;
  }

  // Get next up league night instances
  async getNextUpLeagueNightInstances(
    count: number,
    userId: string
  ): Promise<LeagueNightInstance[]> {
    const response = await this.get<any>(
      `/api/nights?limit=${count}&userId=${userId}`
    );
    console.log("next up league night instances response", response.data);
    return response.data;
  }

  // Get league night instances for a week (date range)
  async getWeekLeagueNightInstances(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<LeagueNightInstance[]> {
    const response = await this.get<any>(
      `/api/nights?userId=${userId}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data || [];
  }

  // Get league night details
  async getLeagueNight(
    leagueId: string,
    nightId: string
  ): Promise<LeagueNightInstance> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}`
    );
    return response.data;
  }

  // Get checked-in players for a league night
  async getCheckedInPlayers(
    leagueId: string,
    nightId: string
  ): Promise<GetCheckedInPlayersResponse> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/checkins`
    );
    return response.data;
  }

  // Check in a player to a league night
  async checkInPlayer(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.post(`/api/leagues/${leagueId}/nights/${nightId}/checkin`, {
      user_id: userId,
    });
  }

  // Uncheck a player from a league night
  async uncheckPlayer(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.request(`/api/leagues/${leagueId}/nights/${nightId}/checkin`, {
      method: "DELETE",
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Send a partnership request
  async sendPartnershipRequest(
    leagueId: string,
    nightId: string,
    requesterId: string,
    requestedId: string
  ): Promise<PartnershipRequest> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-request`,
      {
        requester_id: requesterId,
        requested_id: requestedId,
      }
    );
    return response.data.request;
  }

  // Accept a partnership request
  async acceptPartnershipRequest(
    leagueId: string,
    nightId: string,
    requestId: string,
    userId: string
  ): Promise<ConfirmedPartnership> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-accept`,
      {
        requestId: requestId,
        userId: userId,
      }
    );
    return response.data;
  }

  // Reject a partnership request
  async rejectPartnershipRequest(
    leagueId: string,
    nightId: string,
    requestId: string,
    userId: string
  ): Promise<void> {
    console.log(
      "rejecting partnership request",
      leagueId,
      nightId,
      requestId,
      userId
    );
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-reject`,
      {
        requestId: requestId,
        userId: userId,
      }
    );
  }

  // Get partnership requests for a league night
  async getPartnershipRequests(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<PartnershipRequestResponse> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-requests?user_id=${userId}`
    );
    return response.data;
  }

  // Get user's confirmed partnership
  async getConfirmedPartnership(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<ConfirmedPartnership | null> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/confirmed-partnership?user_id=${userId}`
    );
    return response.data;
  }

  // Get user's current match
  async getCurrentMatch(
    leagueId: string,
    nightId: string,
    partnershipId: string
  ): Promise<GetMatchResponse | null> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/current-match?partnership_id=${partnershipId}`
    );
    return response.data;
  }

  // Get a match
  async getMatch(
    leagueId: string,
    nightId: string,
    matchId: string
  ): Promise<GetMatchResponse> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/matches/${matchId}`
    );
    return response.data;
  }

  async getMatches(
    leagueId: string,
    nightId: string,
    userId?: string
  ): Promise<GetMatchesResponse> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/matches${userId ? `?userId=${userId}` : ""}`
    );
    return response.data;
  }

  // Get tonight's stats for a user
  async getMyStats(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<any> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/my-stats?userId=${userId}`
    );
    return response.data;
  }

  // Remove a partnership
  async removePartnership(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.request(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership`,
      {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId }),
      }
    );
  }

  // Start league night (admin only)
  async startLeague(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.post(`/api/leagues/${leagueId}/nights/${nightId}/start-league`, {
      user_id: userId,
    });
  }

  // End league night (admin only)
  async endLeague(
    leagueId: string,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.post(`/api/leagues/${leagueId}/nights/${nightId}/end-league`, {
      user_id: userId,
    });
  }

  // Update court configuration (admin only)
  async updateCourts(
    leagueId: string,
    nightId: string,
    userId: string,
    courtLabels: string[]
  ): Promise<void> {
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/update-courts`,
      {
        user_id: userId,
        court_labels: courtLabels,
      }
    );
  }

  // Override match score
  async overrideMatchScore(
    leagueId: string,
    nightId: string,
    matchId: string,
    userId: string,
    team1Score: number,
    team2Score: number
  ): Promise<MatchScoreResponse> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/matches/${matchId}/override-score`,
      {
        userId,
        team1Score,
        team2Score,
      }
    );
    return response.data;
  }

  // Cancel match
  async cancelMatch(
    leagueId: string,
    nightId: string,
    matchId: string,
    userId: string
  ): Promise<MatchScoreResponse> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/matches/${matchId}/cancel`,
      {
        userId,
      }
    );
    return response.data;
  }

  // Cancel match score
  async cancelMatchScore(
    leagueId: string,
    nightId: string,
    matchId: string,
    userId: string
  ): Promise<MatchScoreResponse> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/cancel-score`,
      {
        matchId,
        userId,
      }
    );
    return response.data;
  }

  // Submit match score (creates pending score)
  async submitMatchScore(
    leagueId: string,
    nightId: string,
    matchId: string,
    team1Score: number,
    team2Score: number,
    userId: string
  ): Promise<MatchScoreResponse> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/submit-score`,
      {
        matchId: matchId,
        team1Score: team1Score,
        team2Score: team2Score,
        userId: userId,
      }
    );
    return response.data;
  }

  // Confirm opponent's submitted score
  async confirmMatchScore(
    leagueId: string,
    nightId: string,
    matchId: string,
    userId: string
  ): Promise<MatchScoreResponse> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/confirm-score`,
      {
        matchId: matchId,
        userId: userId,
      }
    );
    return response.data;
  }

  // Dispute opponent's submitted score
  async disputeMatchScore(
    leagueId: string,
    nightId: string,
    matchId: string,
    userId: string
  ): Promise<MatchScoreResponse> {
    const response = await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/dispute-score`,
      {
        matchId: matchId,
        userId: userId,
      }
    );
    return response.data;
  }

  // Admin: Create temporary account for player without phone
  async createTempAccount(
    leagueId: string,
    nightId: string,
    adminUserId: string,
    firstName: string,
    lastName: string,
    skillLevel: "Beginner" | "Intermediate" | "Advanced"
  ): Promise<{ user: any; password: string }> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/admin/create-temp-account`,
      {
        admin_user_id: adminUserId,
        first_name: firstName,
        last_name: lastName,
        skill_level: skillLevel,
      }
    );
    return response.data;
  }
}
