// Main API exports
// Central place to import all API services

export { leaguesAPI } from './leagues';
export { membershipService } from './membership';

// Single API object for backward compatibility
import { leaguesAPI } from './leagues';
import { membershipService } from './membership';

export const api = {
  leagues: leaguesAPI,
  membership: membershipService,
};

export default api;