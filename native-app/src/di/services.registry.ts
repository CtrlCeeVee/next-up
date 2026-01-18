// Register all services in the DI container
import { registerInjectable, InjectableType } from "./di";
import { AuthService } from "../features/auth/services";
import { LeaguesService } from "../features/leagues/services";
import { LeagueNightsService } from "../features/league-nights/services";
import { MembershipService } from "../features/membership/services";
import { ProfilesService } from "../features/profiles/services";
import { PushNotificationsService } from "../features/push-notifications/services";

// Create service instances
export const authService = new AuthService();
export const leaguesService = new LeaguesService();
export const leagueNightsService = new LeagueNightsService();
export const membershipService = new MembershipService();
export const profilesService = new ProfilesService();
export const pushNotificationsService = new PushNotificationsService();

// Initialize and register services
function initializeServices() {
  console.log("Initializing services...");
  registerInjectable(InjectableType.AUTH, authService);
  registerInjectable(InjectableType.LEAGUES, leaguesService);
  registerInjectable(InjectableType.LEAGUE_NIGHTS, leagueNightsService);
  registerInjectable(InjectableType.MEMBERSHIP, membershipService);
  registerInjectable(InjectableType.PROFILES, profilesService);
  registerInjectable(
    InjectableType.PUSH_NOTIFICATIONS,
    pushNotificationsService
  );
  console.log("Services initialized successfully");
}

// Auto-initialize services when this module is imported
initializeServices();
