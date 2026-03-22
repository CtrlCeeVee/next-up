import { useState, useEffect } from 'react';
import { leaguesAPI } from '../services/api/leagues';

export interface LeaderboardPlayer {
  rank: number;
  userId: string;
  name: string;
  value: number;
  displayValue: string;
  gamesPlayed: number;
  winRate: number;
  avgPoints: number;
}

export interface LeaderboardData {
  category: string;
  leagueId: number;
  leagueName: string;
  minGames: number;
  totalQualified: number;
  players: LeaderboardPlayer[];
  currentUser: {
    rank: number | null;
    userId: string;
    name: string;
    value: number;
    displayValue: string;
    gamesPlayed: number;
    winRate: number;
    avgPoints: number;
    gamesNeeded: number;
  } | null;
}

export type LeaderboardCategory = 'overall' | 'games' | 'avg_score' | 'win_streak' | 'attendance';

export const useLeaderboard = (leagueId: number | null, category: LeaderboardCategory, userId?: string) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!leagueId) return;

      try {
        setLoading(true);
        const data = await leaguesAPI.getLeaderboard(leagueId, category, userId);
        setLeaderboard(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leagueId, category, userId]);

  return { leaderboard, loading, error };
};
