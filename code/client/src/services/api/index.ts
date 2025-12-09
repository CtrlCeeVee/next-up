// Main API exports
// Central place to import all API services

export { leaguesAPI } from './leagues';
export { membershipService } from './membership';
export { leagueNightService } from './leagueNights';
export { profilesAPI } from './profiles';
export { devService } from './dev';

// Single API object for backward compatibility
import { leaguesAPI } from './leagues';
import { membershipService } from './membership';
import { leagueNightService } from './leagueNights';
import { profilesAPI } from './profiles';
import { devService } from './dev';

export const api = {
  leagues: leaguesAPI,
  membership: membershipService,
  leagueNights: leagueNightService,
  profiles: profilesAPI,
  dev: devService,
};

export default api;