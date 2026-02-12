import { BaseModel } from "../../../core/models";
import { Player } from "../../player/types";

export interface Membership extends BaseModel {
  league_id: string;
  user_id: string;
  role: "player" | "admin";
  is_active: boolean;
  joined_at: string;
}

export interface LeagueMember extends Player {
  role: "player" | "admin";
  joinedAt: string;
}
