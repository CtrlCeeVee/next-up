// Main API exports
// Central place to import all API services

export { leaguesAPI } from './leagues';
export { membershipService } from './membership';
export { leagueNightService } from './leagueNights';
export { devService } from './dev';

// Single API object for backward compatibility
import { leaguesAPI } from './leagues';
import { membershipService } from './membership';
import { leagueNightService } from './leagueNights';
import { devService } from './dev';

export const api = {
  leagues: leaguesAPI,
  membership: membershipService,
  leagueNights: leagueNightService,
  dev: devService,
};

export default api;