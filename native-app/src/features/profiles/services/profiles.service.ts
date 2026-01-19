import { BaseService } from "../../../core/services";
import type { ProfileData, UpdateProfileData, PlayerStreaks, PlayerStats } from "../types";

export class ProfilesService extends BaseService {
  constructor() {
    super();
  }

  // Get profile by username
  async getProfileByUsername(username: string): Promise<ProfileData> {
    const response = await this.get<any>(`/api/profiles/${username}`);
    return response.data;
  }

  // Get profile by user ID
  async getProfileByUserId(userId: string): Promise<ProfileData> {
    const response = await this.get<any>(`/api/profiles/user/${userId}`);
    return response.data;
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
    const response = await this.get<any>(`/api/profiles/${userId}/streaks`);
    return response.data;
  }

  // Get player stats
  async getPlayerStats(userId: string): Promise<PlayerStats> {
    const response = await this.get<any>(`/api/leagues/player-stats?user_id=${userId}`);
    return response.data;
  }
}
