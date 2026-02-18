import { ConfirmedPartnership, Match } from "./league-night";

export interface GetMatchResponse {
  match: Match;
  courtLabel: string;
  partnership1: ConfirmedPartnership;
  partnership2: ConfirmedPartnership;
}
