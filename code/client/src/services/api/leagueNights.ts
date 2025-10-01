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

export interface PartnershipRequest {
  id: number;
  league_night_instance_id: number;
  requester_id: string;
  requested_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  requester: {
    id: string;
    first_name: string;
    last_name: string;
    skill_level: string;
  };
  requested: {
    id: string;
    first_name: string;
    last_name: string;
    skill_level: string;
  };
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

  // Uncheck a player from a league night
  async uncheckPlayer(leagueId: number, nightId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/checkin`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to uncheck player');
    }
    
    return response.json();
  }

  // Send a partnership request
  async sendPartnershipRequest(leagueId: number, nightId: string, requesterId: string, requestedId: string): Promise<PartnershipRequest> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/partnership-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        requester_id: requesterId, 
        requested_id: requestedId 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send partnership request');
    }
    
    const result = await response.json();
    return result.data.request;
  }

  // Accept a partnership request
  async acceptPartnershipRequest(leagueId: number, nightId: string, requestId: number, userId: string): Promise<Partnership> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/partnership-accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        request_id: requestId, 
        user_id: userId 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to accept partnership request');
    }
    
    const result = await response.json();
    return result.data.partnership;
  }

  // Reject a partnership request
  async rejectPartnershipRequest(leagueId: number, nightId: string, requestId: number, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/partnership-reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        request_id: requestId, 
        user_id: userId 
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reject partnership request');
    }
    
    return response.json();
  }

  // Get partnership requests for a user
  async getPartnershipRequests(leagueId: number, nightId: string, userId: string): Promise<PartnershipRequest[]> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/partnership-requests?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch partnership requests');
    }
    
    const result = await response.json();
    return result.data;
  }

  // Remove a partnership
  async removePartnership(leagueId: number, nightId: string, userId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/partnership`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove partnership');
    }
    
    return response.json();
  }
}

export const leagueNightService = new LeagueNightService();