import { BaseModel } from "../../../core/models";
import { Player } from "../../player/types";

export interface Membership extends BaseModel {
  leagueId: string;
  userId: string;
  role: "player" | "admin";
  isActive: boolean;
  joinedAt: string;
}

export interface LeagueMember extends Player {
  role: "player" | "admin";
  joinedAt: string;
}
