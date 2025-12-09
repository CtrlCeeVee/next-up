// Custom hook for fetching player statistics
// Provides player stats across all leagues and individual league performance

import { useState, useEffect } from 'react';
import { leaguesAPI } from '../services/api/leagues';

// Interface matching backend API response
interface LeagueStatsFromAPI {
  leagueId: number;
  leagueName: string;
  leagueLocation?: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  averagePoints: number;
  totalPoints: number;
  totalPlayers: number;
  ranking: number;
}

interface OverallStatsFromAPI {
  totalLeagues: number;
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalGamesLost: number;
  overallWinRate: number;
  overallAvgPoints: number;
  totalPoints: number;
}

interface PlayerStatsResponse {
  overall: OverallStatsFromAPI;
  leagueStats: LeagueStatsFromAPI[];
}

// Interface for frontend use (matching existing ProfilePage interfaces)
export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalPoints: number;
  averagePoints: number;
  currentStreak: number;
  bestStreak: number;
  leaguesJoined: number;
  activeLeagues: number;
}

export interface LeagueStats {
  leagueId: number;
  leagueName: string;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
  ranking: number;
  totalPlayers: number;
}

interface UsePlayerStatsReturn {
  stats: PlayerStats | null;
  leagueStats: LeagueStats[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePlayerStats = (userId: string | null): UsePlayerStatsReturn => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [leagueStats, setLeagueStats] = useState<LeagueStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerStats = async () => {
    if (!userId) {
      setStats(null);
      setLeagueStats([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: PlayerStatsResponse = await leaguesAPI.getPlayerStats(userId);
      
      // Transform API response to match frontend interfaces
      const transformedStats: PlayerStats = {
        totalGames: response.overall.totalGamesPlayed,
        wins: response.overall.totalGamesWon,
        losses: response.overall.totalGamesLost,
        winRate: response.overall.overallWinRate,
        totalPoints: response.overall.totalPoints,
        averagePoints: response.overall.overallAvgPoints,
        // TODO: Calculate streaks from match history when available
        currentStreak: 0,
        bestStreak: 0,
        leaguesJoined: response.overall.totalLeagues,
        activeLeagues: response.overall.totalLeagues // For now, assume all leagues are active
      };

      const transformedLeagueStats: LeagueStats[] = response.leagueStats.map((league) => ({
        leagueId: league.leagueId,
        leagueName: league.leagueName,
        games: league.gamesPlayed,
        wins: league.gamesWon,
        losses: league.gamesLost,
        winRate: league.winRate,
        points: league.totalPoints,
        ranking: league.ranking,
        totalPlayers: league.totalPlayers
      }));

      setStats(transformedStats);
      setLeagueStats(transformedLeagueStats);

    } catch (err) {
      console.error('Error fetching player stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch player statistics');
      
      // Set empty states on error
      setStats(null);
      setLeagueStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerStats();
  }, [userId]);

  return {
    stats,
    leagueStats,
    loading,
    error,
    refetch: fetchPlayerStats
  };
};