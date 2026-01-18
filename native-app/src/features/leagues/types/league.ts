import { BaseModel } from "../../../core/models";

export interface League extends BaseModel {
  name: string;
  description: string;
  location: string;
  address: string;
  leagueDays: string[];
  startTime: string;
  totalPlayers: number;
  isActive: boolean;
  skillLevel?: string; // Deprecated - keeping for backward compatibility
}

export interface TopPlayer {
  id: string;
  name: string;
  avgScore: number;
  gamesPlayed: number;
  position: number;
  winRate?: number;
  isCurrentUser?: boolean;
  email?: string;
  profilePicture?: string;
}

export interface LeagueStats {
  totalMembers: number;
  totalGamesPlayed: number;
  averageAttendance: number;
}
