// Main API exports
// Central place to import all API services

export { leaguesAPI } from './leagues';

// Single API object for backward compatibility
import { leaguesAPI } from './leagues';

export const api = {
  leagues: leaguesAPI,
};

export default api;