import { BaseModel } from "../../../core/models";

export interface ProfileData extends BaseModel {
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
    result: "W" | "L";
    completedAt: string;
  }>;
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPoints: number;
  averagePoints: number;
  leaguesJoined: number;
  activeLeagues: number;
}
