import { ProfileData } from "../../../profiles/types";
import { Membership } from "../../types";

export interface GetMembershipResponse {
  membership: Membership;
  profile: ProfileData;
}
