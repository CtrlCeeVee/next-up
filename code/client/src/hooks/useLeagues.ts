import { useState, useEffect } from 'react'
import { leaguesAPI } from '../services/api'

export interface League {
  id: number
  name: string
  description: string
  location: string
  address: string
  leagueDays: string[]
  startTime: string
  totalPlayers: number
  isActive: boolean
  // Deprecated - keeping for backward compatibility, can be removed later
  skillLevel?: string
}

export interface TopPlayer {
  id: string
  name: string
  avgScore: number
  gamesPlayed: number
  position: number
  // Optional properties that can be calculated on the frontend
  winRate?: number
  isCurrentUser?: boolean
  email?: string
  profilePicture?: string
}

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeagues() {
      try {
        setLoading(true)
        const data = await leaguesAPI.getAll()
        
        // Add delay on localhost to see loading effect
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          await new Promise(resolve => setTimeout(resolve, 3000)) // 2 second delay
        }
        
        setLeagues(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leagues')
      } finally {
        setLoading(false)
      }
    }

    fetchLeagues()
  }, [])

  return { leagues, loading, error }
}

export function useLeague(leagueId: number) {
  const [league, setLeague] = useState<League | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeague() {
      try {
        setLoading(true)
        const data = await leaguesAPI.getById(leagueId)
        setLeague(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch league')
      } finally {
        setLoading(false)
      }
    }

    if (leagueId > 0) {
      fetchLeague()
    }
  }, [leagueId])

  return { league, loading, error }
}

// Hook for fetching top players
export const useTopPlayers = (leagueId: string | undefined, userEmail: string) => {
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      if (!leagueId) return;
      
      try {
        setLoading(true);
        const data = await leaguesAPI.getTopPlayers(leagueId);
        
        // Add isCurrentUser flag based on email match
        const playersWithCurrentUser = data.map((player: any) => ({
          ...player,
          isCurrentUser: player.email === userEmail
        }));
        
        setTopPlayers(playersWithCurrentUser);
        setError(null);
      } catch (err) {
        console.error('Error fetching top players:', err);
        setError('Failed to load top players');
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, [leagueId, userEmail]);

  return { topPlayers, loading, error };
};

// Interface for league statistics
export interface LeagueStats {
  totalMembers: number;
  totalGamesPlayed: number;
  averageAttendance: number;
}

// Hook for fetching league statistics
export const useLeagueStats = (leagueId: string | undefined) => {
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!leagueId) return;
      
      try {
        setLoading(true);
        const data = await leaguesAPI.getStats(leagueId);
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching league stats:', err);
        setError('Failed to load league statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [leagueId]);

  return { stats, loading, error };
};