// League API service
// Handles all league-related API calls

import { apiRequest } from './base';

export const leaguesAPI = {
  // Get all leagues
  getAll: async () => {
    const response = await apiRequest('/api/leagues');
    return response.success ? response.data : response;
  },

  // Get league by ID
  getById: async (id: number) => {
    const response = await apiRequest(`/api/leagues/${id}`);
    return response.success ? response.data : response;
  },

  // Get top players for a league
  getTopPlayers: async (leagueId: string) => {
    const response = await apiRequest(`/api/leagues/${leagueId}/top-players`);
    return response.success ? response.data : response;
  },

  // Get league statistics
  getStats: async (leagueId: string) => {
    const response = await apiRequest(`/api/leagues/${leagueId}/stats`);
    return response.success ? response.data : response;
  },

  // Get player statistics across all leagues
  getPlayerStats: async (userId: string) => {
    const response = await apiRequest(`/api/leagues/player-stats?user_id=${userId}`);
    return response.success ? response.data : response;
  }
};