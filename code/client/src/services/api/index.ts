// Main API exports
// Central place to import all API services

export { leaguesAPI } from './leagues';
export { membershipService } from './membership';
export { leagueNightService } from './leagueNights';

// Single API object for backward compatibility
import { leaguesAPI } from './leagues';
import { membershipService } from './membership';
import { leagueNightService } from './leagueNights';

export const api = {
  leagues: leaguesAPI,
  membership: membershipService,
  leagueNights: leagueNightService,
};

export default api;