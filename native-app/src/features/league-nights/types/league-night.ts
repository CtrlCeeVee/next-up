import { BaseModel } from "../../../core/models";
import { Player } from "../../player/types";
import { ProfileData } from "../../profiles/types";

export interface LeagueNightInstance extends BaseModel {
  leagueId: string;
  day: string;
  time: string;
  date: string;
  status: "scheduled" | "active" | "completed";
  courtsAvailable: number;
  courtLabels?: string[];
  autoAssignmentEnabled?: boolean;
  checkedInCount: number;
  partnershipsCount: number;
  possibleGames: number;
  checkins: CheckedInPlayer[];
  requests: PartnershipRequest[];
}

export interface CheckedInPlayer {
  id: string;
  checkedInAt: string;
}

export interface PartnershipRequestResponse {
  confirmedPartnership: ConfirmedPartnership | null;
  sentRequests: PartnershipRequest[];
  receivedRequests: PartnershipRequest[];
}

export interface PartnershipRequest {
  id: string;
  leagueNightInstanceId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  requester: {
    id: string;
    firstName: string;
    lastName: string;
    skillLevel: string;
  };
  requested: {
    id: string;
    firstName: string;
    lastName: string;
    skillLevel: string;
  };
}

export interface ConfirmedPartnership {
  id: string;
  leagueNightInstanceId: string;
  player1Id: string;
  player2Id: string;
  isActive: boolean;
  createdAt: string;
}

export interface PartnershipRequestsResponse {
  requests: PartnershipRequest[];
  confirmedPartnership: ConfirmedPartnership | null;
}

export enum MatchStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DISPUTED = "disputed",
  CANCELLED = "cancelled",
}

export enum MatchScoreStatus {
  NONE = "none",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DISPUTED = "disputed",
}

export const MATCH_COMPLETED_STATUSES = [MatchStatus.COMPLETED, MatchStatus.CANCELLED];

export interface Match {
  id: string;
  leagueNightInstanceId: number;
  partnership1Id: string;
  partnership2Id: string;
  courtNumber: string;
  team1Score: number | null;
  team2Score: number | null;
  status: MatchStatus;
  scoreStatus: MatchScoreStatus;
  pendingTeam1Score: number | null;
  pendingTeam2Score: number | null;
  pendingSubmittedByPartnershipId: string | null;
  pendingScoreSubmittedAt: string | null;
  createdAt: string;
}
