import { BaseService } from "../../../core/services";
import type {
  LeagueNightInstance,
  CheckedInPlayer,
  PartnershipRequest,
  Partnership,
  PartnershipRequestsResponse,
} from "../types";

export class LeagueNightsService extends BaseService {
  constructor() {
    super();
  }

  // Get league night details
  async getLeagueNight(
    leagueId: number,
    nightId: string
  ): Promise<LeagueNightInstance> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}`
    );
    return response.data;
  }

  // Get checked-in players for a league night
  async getCheckedInPlayers(
    leagueId: number,
    nightId: string
  ): Promise<CheckedInPlayer[]> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/checkins`
    );
    return response.data;
  }

  // Check in a player to a league night
  async checkInPlayer(
    leagueId: number,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.post(`/api/leagues/${leagueId}/nights/${nightId}/checkin`, {
      user_id: userId,
    });
  }

  // Uncheck a player from a league night
  async uncheckPlayer(
    leagueId: number,
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
    leagueId: number,
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
    leagueId: number,
    nightId: string,
    requestId: number,
    userId: string
  ): Promise<Partnership> {
    const response = await this.post<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-accept`,
      {
        request_id: requestId,
        user_id: userId,
      }
    );
    return response.data.partnership;
  }

  // Reject a partnership request
  async rejectPartnershipRequest(
    leagueId: number,
    nightId: string,
    requestId: number,
    userId: string
  ): Promise<void> {
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-reject`,
      {
        request_id: requestId,
        user_id: userId,
      }
    );
  }

  // Get partnership requests for a user
  async getPartnershipRequests(
    leagueId: number,
    nightId: string,
    userId: string
  ): Promise<PartnershipRequestsResponse> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/nights/${nightId}/partnership-requests?user_id=${userId}`
    );
    return response.data;
  }

  // Remove a partnership
  async removePartnership(
    leagueId: number,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.request(`/api/leagues/${leagueId}/nights/${nightId}/partnership`, {
      method: "DELETE",
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Start league night (admin only)
  async startLeague(
    leagueId: number,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/start-league`,
      {
        user_id: userId,
      }
    );
  }

  // End league night (admin only)
  async endLeague(
    leagueId: number,
    nightId: string,
    userId: string
  ): Promise<void> {
    await this.post(`/api/leagues/${leagueId}/nights/${nightId}/end-league`, {
      user_id: userId,
    });
  }

  // Update court configuration (admin only)
  async updateCourts(
    leagueId: number,
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

  // Submit match score (creates pending score)
  async submitMatchScore(
    leagueId: number,
    nightId: string,
    matchId: number,
    team1Score: number,
    team2Score: number,
    userId: string
  ): Promise<void> {
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/submit-score`,
      {
        match_id: matchId,
        team1_score: team1Score,
        team2_score: team2Score,
        user_id: userId,
      }
    );
  }

  // Confirm opponent's submitted score
  async confirmMatchScore(
    leagueId: number,
    nightId: string,
    matchId: number,
    userId: string
  ): Promise<void> {
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/confirm-score`,
      {
        match_id: matchId,
        user_id: userId,
      }
    );
  }

  // Dispute opponent's submitted score
  async disputeMatchScore(
    leagueId: number,
    nightId: string,
    matchId: number,
    userId: string
  ): Promise<void> {
    await this.post(
      `/api/leagues/${leagueId}/nights/${nightId}/dispute-score`,
      {
        match_id: matchId,
        user_id: userId,
      }
    );
  }

  // Admin: Create temporary account for player without phone
  async createTempAccount(
    leagueId: number,
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
