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
  partnerships: Partnership[];
  requests: PartnershipRequest[];
}

export interface CheckedInPlayer {
  id: string;
  checkedInAt: string;
}

export interface Partnership {
  id: string;
  player1: Player;
  player2: Player;
  confirmed_at: string;
  is_active: boolean;
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
  player1: {
    id: string;
    firstName: string;
    lastName: string;
    skillLevel: string;
  };
  player2: {
    id: string;
    firstName: string;
    lastName: string;
    skillLevel: string;
  };
}

export interface PartnershipRequestsResponse {
  requests: PartnershipRequest[];
  confirmedPartnership: ConfirmedPartnership | null;
}

export interface Match {
  id: number;
  league_night_instance_id: number;
  team1_player1_id: string;
  team1_player2_id: string;
  team2_player1_id: string;
  team2_player2_id: string;
  court_label: string;
  status: "in_progress" | "completed" | "disputed";
  team1_score: number | null;
  team2_score: number | null;
  created_at: string;
  completed_at: string | null;
  pending_score_submitted_by?: string;
}
