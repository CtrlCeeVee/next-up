// code/client/src/services/api/profiles.ts
import { apiRequest } from './base';

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  skillLevel: string;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  joinedDate: string;
}

export interface UpdateProfileData {
  bio?: string;
  location?: string;
  skillLevel?: string;
}

export interface PlayerStreaks {
  currentStreak: number;
  bestStreak: number;
  recentForm: Array<{
    result: 'W' | 'L';
    completedAt: string;
  }>;
}

export const profilesAPI = {
  // Get profile by username
  getProfileByUsername: async (username: string): Promise<ProfileData> => {
    const response = await apiRequest<{ success: boolean; data: ProfileData }>(`/api/profiles/${username}`);
    return response.data;
  },

  // Get profile by user ID
  getProfileByUserId: async (userId: string): Promise<ProfileData> => {
    const response = await apiRequest<{ success: boolean; data: ProfileData }>(`/api/profiles/user/${userId}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (userId: string, data: UpdateProfileData): Promise<ProfileData> => {
    const response = await apiRequest<{ success: boolean; data: ProfileData }>(`/api/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // Get player streaks and recent form
  getPlayerStreaks: async (userId: string): Promise<PlayerStreaks> => {
    const response = await apiRequest<{ success: boolean; data: PlayerStreaks }>(`/api/profiles/${userId}/streaks`);
    return response.data;
  },
};
