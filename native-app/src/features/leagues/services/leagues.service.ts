import { BaseService } from "../../../core/services";
import type { League, TopPlayer, LeagueStats } from "../types";

export class LeaguesService extends BaseService {
  constructor() {
    super();
  }

  // Get all leagues
  async getAll(): Promise<League[]> {
    // const response = await this.get<any>("/api/leagues");
    // return response.success ? response.data : response;
    return Promise.resolve([
      {
        id: "1",
        name: "Northcliff Night League",
        description: "Premier pickleball league at Northcliff Country Club featuring competitive play for passionate players of all skill levels",
        location: "Northcliff Country Club",
        address: "271 Pendoring Rd, Northcliff, Randburg, 2115",
        leagueDays: ["Monday", "Wednesday"],
        startTime: "18:30",
        totalPlayers: 10,
        isActive: true,
      },
    ]);
  }

  // Get league by ID
  async getById(id: number): Promise<League> {
    const response = await this.get<any>(`/api/leagues/${id}`);
    return response.success ? response.data : response;
  }

  // Get top players for a league
  async getTopPlayers(leagueId: string): Promise<TopPlayer[]> {
    const response = await this.get<any>(
      `/api/leagues/${leagueId}/top-players`
    );
    return response.success ? response.data : response;
  }

  // Get league statistics
  async getStats(leagueId: string): Promise<LeagueStats> {
    const response = await this.get<any>(`/api/leagues/${leagueId}/stats`);
    return response.success ? response.data : response;
  }

  // Get player statistics across all leagues
  async getPlayerStats(userId: string): Promise<any> {
    const response = await this.get<any>(
      `/api/leagues/player-stats?user_id=${userId}`
    );
    return response.success ? response.data : response;
  }
}
