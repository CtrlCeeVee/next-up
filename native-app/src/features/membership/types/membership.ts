import { BaseModel } from "../../../core/models";

export interface Membership extends BaseModel {
  league_id: string;
  user_id: string;
  role: "player" | "admin";
  is_active: boolean;
  joined_at: string;
}

export interface LeagueMember {
  id: string;
  name: string;
  email: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  role: "player" | "admin";
  joinedAt: string;
}
