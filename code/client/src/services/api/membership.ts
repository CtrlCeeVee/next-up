// League membership API service
import { API_BASE_URL } from './base';

export interface Membership {
  id: string;
  league_id: number;
  user_id: string;
  role: 'player' | 'admin';
  is_active: boolean;
  joined_at: string;
}

export interface LeagueMember {
  id: string;
  name: string;
  email: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  role: 'player' | 'admin';
  joinedAt: string;
}

class MembershipService {
  // Check if user is a member of a league
  async checkMembership(leagueId: number, userId: string): Promise<{ isMember: boolean; membership: Membership | null }> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/membership?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check membership');
    }
    
    const result = await response.json();
    return result.data;
  }

  // Join a league
  async joinLeague(leagueId: number, userId: string): Promise<{ membership: Membership; playerStats: any }> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to join league');
    }
    
    const result = await response.json();
    return result.data;
  }

  // Get league members
  async getLeagueMembers(leagueId: number): Promise<LeagueMember[]> {
    const response = await fetch(`${API_BASE_URL}/api/leagues/${leagueId}/members`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch league members');
    }
    
    const result = await response.json();
    return result.data;
  }
}

export const membershipService = new MembershipService();