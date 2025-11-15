// Development/Testing API
// Only available in development mode

import { supabase } from '../supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const devService = {
  // Simulate bot players checking in
  simulateCheckIns: async (leagueNightId: number, count: number) => {
    const response = await fetch(`${API_URL}/api/dev/simulate-checkins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueNightId, count })
    });
    if (!response.ok) throw new Error('Failed to simulate check-ins');
    return response.json();
  },

  // Auto-create partnerships from checked-in players
  simulatePartnerships: async (leagueNightId: number) => {
    const response = await fetch(`${API_URL}/api/dev/simulate-partnerships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueNightId })
    });
    if (!response.ok) throw new Error('Failed to simulate partnerships');
    return response.json();
  },

  // Complete a random active match with random score
  completeRandomMatch: async (leagueNightId: number) => {
    const response = await fetch(`${API_URL}/api/dev/complete-random-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leagueNightId })
    });
    if (!response.ok) throw new Error('Failed to complete match');
    return response.json();
  },

  // Reset entire league night (delete all data)
  resetLeagueNight: async (leagueNightId: number) => {
    const response = await fetch(`${API_URL}/api/dev/reset-league-night/${leagueNightId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to reset league night');
    return response.json();
  }
};
