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
};