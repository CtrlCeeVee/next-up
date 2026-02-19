import { BaseModel } from "../../../core/models";
import { DayOfWeek } from "../../../core/types";
import { LeagueMember } from "../../membership/types";

export interface League extends BaseModel {
  name: string;
  description: string;
  location: string;
  address: string;
  leagueDays: DayOfWeek[];
  startTime: string;
  totalPlayers: number;
  isActive: boolean;
  skillLevel?: string; // Deprecated - keeping for backward compatibility
  members?: LeagueMember[];

  // need to add
  bannerUrl?: string;
  logoUrl?: string;
  latitude?: number;
  longitude?: number;
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
