import { BaseService } from "../../../core/services";
import type { Membership, LeagueMember } from "../types";

export class MembershipService extends BaseService {
  constructor() {
    super();
  }

  // Check if user is a member of a league
  async checkMembership(
    leagueId: number,
    userId: string
  ): Promise<{ isMember: boolean; membership: Membership | null }> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/membership?user_id=${userId}`
    );
    return response.data;
  }

  // Join a league
  async joinLeague(
    leagueId: number,
    userId: string
  ): Promise<{ membership: Membership; playerStats: any }> {
    const response = await this.post<any>(`/api/leagues/${leagueId}/join`, {
      user_id: userId,
    });
    return response.data;
  }

  async getAll(userId: string): Promise<Membership[]> {
    const response = await this.get<any>(`/api/memberships?user_id=${userId}`);
    return response.data;
  }

  // Get league members
  async getLeagueMembers(leagueId: number): Promise<LeagueMember[]> {
    // const response = await this.get<any>(`/api/leagues/${leagueId}/members`);
    return Promise.resolve([
      {
        id: "cd951913-ba1c-4dcf-b367-a3c9928c06a2",
        name: "John Doe",
        email: "john.doe@example.com",
        skillLevel: "Beginner",
        role: "player",
        joinedAt: "2021-01-01",
      },
      {
        id: "2",
        name: "John Doe",
        email: "john.doe@example.com",
        skillLevel: "Beginner",
        role: "player",
        joinedAt: "2021-01-01",
      },
    ])
    // return response.data;
  }
}
