// League Night API service
import { API_BASE_URL } from './base';

export interface LeagueNightInstance {
  id: number;
  day: string;
  time: string;
  date: string;
  status: 'scheduled' | 'active' | 'completed';
  courtsAvailable: number;
  checkedInCount: number;
  partnershipsCount: number;
  possibleGames: number;
}

export interface CheckedInPlayer {
  id: string;
  name: string;
  email: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  checkedInAt: string;
  hasPartner: boolean;
  partnerId?: string;
}

export interface Partnership {
  id: number;
  player1_id: string;
  player2_id: string;
  confirmed_at: string;
  is_active: boolean;
}

class LeagueNightService {
  // Get league night details
  async getLeagueNight(leagueId: number, nightId: string, forceToday: boolean = false): Promise<LeagueNightInstance> {
    const queryParams = forceToday ? '?forceToday=true' : '';
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch league night');
    }
    
    const result = await response.json();
    return result.data;
  }

  // Get league night for testing (forces today's date)
  async getLeagueNightForTesting(leagueId: number, nightId: string): Promise<LeagueNightInstance> {
    return this.getLeagueNight(leagueId, nightId, true);
  }

  // Get checked-in players for a league night
  async getCheckedInPlayers(leagueId: number, nightId: string): Promise<CheckedInPlayer[]> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/checkins`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch checked-in players');
    }
    
    const result = await response.json();
    return result.data;
  }

  // Check in a player to a league night
  async checkInPlayer(leagueId: number, nightId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check in player');
    }
    
    return response.json();
  }

  // Create a partnership between two players
  async createPartnership(leagueId: number, nightId: string, player1Id: string, player2Id: string): Promise<Partnership> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/partnership`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        player1_id: player1Id, 
        player2_id: player2Id 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create partnership');
    }
    
    const result = await response.json();
    return result.data.partnership;
  }
}

export const leagueNightService = new LeagueNightService();