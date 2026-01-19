import { BaseModel } from "../../../core/models";

export interface LeagueNightInstance extends BaseModel {
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
}

export interface CheckedInPlayer {
  id: string;
  name: string;
  email: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  checkedInAt: string;
  hasPartner: boolean;
  partnerId?: string;
}

export interface Partnership {
  id: string;
  player1_id: string;
  player2_id: string;
  confirmed_at: string;
  is_active: boolean;
}

export interface PartnershipRequest {
  id: string;
  league_night_instance_id: string;
  requester_id: string;
  requested_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  requester: {
    id: string;
    first_name: string;
    last_name: string;
    skill_level: string;
  };
  requested: {
    id: string;
    first_name: string;
    last_name: string;
    skill_level: string;
  };
}

export interface ConfirmedPartnership {
  id: string;
  league_night_instance_id: string;
  player1_id: string;
  player2_id: string;
  is_active: boolean;
  created_at: string;
  player1: {
    id: string;
    first_name: string;
    last_name: string;
    skill_level: string;
  };
  player2: {
    id: string;
    first_name: string;
    last_name: string;
    skill_level: string;
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
