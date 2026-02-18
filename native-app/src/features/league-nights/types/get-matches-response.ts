import { GetMatchResponse } from "./get-match-response";
import { ProfileData } from "../../profiles/types";

export interface GetMatchesResponse {
  matches: GetMatchResponse[];
  profiles: ProfileData[];
}