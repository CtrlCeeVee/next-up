import type { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  // We can extend this later if needed
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}
