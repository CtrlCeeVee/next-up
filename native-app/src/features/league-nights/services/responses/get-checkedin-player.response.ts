import { ProfileData } from "../../../profiles/types";
import { CheckedInPlayer } from "../../types";

export interface GetCheckedInPlayerResponse {
  checkin: CheckedInPlayer;
  profile: ProfileData;
  hasPartner: boolean;
  partnerId?: string;
}
