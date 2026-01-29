import { BaseService } from "../../../core/services";
import type { Membership, LeagueMember } from "../types";

export class MembershipService extends BaseService {
  constructor() {
    super();
  }

  // Join a league
  async joinLeague(
    leagueId: string,
    userId: string
  ): Promise<{ membership: Membership; playerStats: any }> {
    const response = await this.post<any>(`/api/leagues/${leagueId}/join`, {
      user_id: userId,
    });
    return response.data;
  }

  // Leave a league
  async leaveLeague(
    leagueId: string,
    userId: string
  ): Promise<void> {
    await this.request(`/api/leagues/${leagueId}/leave`, {
      method: "DELETE",
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async getAll(userId: string): Promise<Membership[]> {
    const response = await this.get<any>(`/api/leagues/memberships?user_id=${userId}`);
    return response.data;
  }

  // Get league members
  async getLeagueMembers(leagueId: string): Promise<LeagueMember[]> {
    const response = await this.get<any>(`/api/leagues/${leagueId}/members`);
    return response.data;
  }
}
