import { BaseService } from "../../../core/services";
import type { ProfileData, UpdateProfileData, PlayerStreaks, PlayerStats } from "../types";

export class ProfilesService extends BaseService {
  constructor() {
    super();
  }

  // Get profile by username
  async getProfileByUsername(username: string): Promise<ProfileData> {
    // const response = await this.get<any>(`/api/profiles/${username}`);
    // return response.data;
    return Promise.resolve({
      id: "1",
      username: "john.doe",
      email: "john.doe@example.com",
      name: "John Doe",
      firstName: "John",
      lastName: "Doe",
      skillLevel: "Beginner",
      bio: "I am a beginner player",
      location: "New York, NY",
      avatarUrl: "https://example.com/avatar.png",
      joinedDate: "2021-01-01",
    });
  }

  // Get profile by user ID
  async getProfileByUserId(userId: string): Promise<ProfileData> {
    // const response = await this.get<any>(`/api/profiles/user/${userId}`);
    // return response.data;
    return Promise.resolve({
      id: "1",
      username: "john.doe",
      email: "john.doe@example.com",
      name: "John Doe",
      firstName: "John",
      lastName: "Doe",
      skillLevel: "Beginner",
      bio: "I am a beginner player",
      location: "New York, NY",
      avatarUrl: "",
      joinedDate: "2021-01-01",
    });
  }

  // Update profile
  async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<ProfileData> {
    const response = await this.put<any>(`/api/profiles/${userId}`, data);
    return response.data;
  }

  // Get player streaks and recent form
  async getPlayerStreaks(userId: string): Promise<PlayerStreaks> {
    // const response = await this.get<any>(`/api/profiles/${userId}/streaks`);
    // return response.data;
    return Promise.resolve({
      currentStreak: 5,
      bestStreak: 10,
      recentForm: [
        { result: "W", completedAt: "2021-01-01" },
        { result: "W", completedAt: "2021-01-02" },
        { result: "L", completedAt: "2021-01-03" },
        { result: "W", completedAt: "2021-01-04" },
        { result: "W", completedAt: "2021-01-05" },
      ],
    });
  }

  // Get player stats
  async getPlayerStats(userId: string): Promise<PlayerStats> {
    // const response = await this.get<any>(`/api/leagues/player-stats?user_id=${userId}`);
    // return response.data;
    return Promise.resolve({
      totalGames: 10,
      wins: 5,
      losses: 5,
      winRate: 50,
      totalPoints: 100,
      averagePoints: 10,
      leaguesJoined: 1,
      activeLeagues: 1,
    });
  }
}
