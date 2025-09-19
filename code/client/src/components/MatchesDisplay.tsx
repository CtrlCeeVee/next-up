import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Target } from 'lucide-react';
import ScoreSubmission from './ScoreSubmission';

interface Match {
  id: number;
  court_number: number;
  status: 'active' | 'completed' | 'cancelled';
  team1_score?: number;
  team2_score?: number;
  created_at: string;
  completed_at?: string;
  partnership1: {
    id: number;
    player1: { id: string; full_name: string; skill_level: string };
    player2: { id: string; full_name: string; skill_level: string };
  };
  partnership2: {
    id: number;
    player1: { id: string; full_name: string; skill_level: string };
    player2: { id: string; full_name: string; skill_level: string };
  };
}

interface MatchesDisplayProps {
  leagueId: string;
  nightId: string;
  currentUserId?: string;
  onCreateMatches: () => void;
  isAdmin?: boolean;
}

const MatchesDisplay: React.FC<MatchesDisplayProps> = ({ 
  leagueId, 
  nightId, 
  currentUserId,
  onCreateMatches,
  isAdmin = false
}) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingMatches, setCreatingMatches] = useState(false);
  const [queueInfo, setQueueInfo] = useState<{
    partnershipsWaiting: number;
    message?: string;
    details?: any;
  } | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/matches`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      
      const data = await response.json();
      if (data.success) {
        setMatches(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch matches');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatches = async () => {
    try {
      setCreatingMatches(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/create-matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create matches');
      }
      
      const data = await response.json();
      if (data.success) {
        // Update queue information
        setQueueInfo({
          partnershipsWaiting: data.data.partnershipsWaiting || 0,
          message: data.data.message,
          details: data.data.queueInfo
        });
        
        // Refresh matches list
        await fetchMatches();
        onCreateMatches();
      } else {
        throw new Error(data.error || 'Failed to create matches');
      }
    } catch (err) {
      console.error('Error creating matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to create matches');
    } finally {
      setCreatingMatches(false);
    }
  };

  const isUserInMatch = (match: Match): boolean => {
    if (!currentUserId) return false;
    return (
      match.partnership1.player1.id === currentUserId ||
      match.partnership1.player2.id === currentUserId ||
      match.partnership2.player1.id === currentUserId ||
      match.partnership2.player2.id === currentUserId
    );
  };

  const getUserTeam = (match: Match): 'team1' | 'team2' | null => {
    if (!currentUserId) return null;
    if (match.partnership1.player1.id === currentUserId || match.partnership1.player2.id === currentUserId) {
      return 'team1';
    }
    if (match.partnership2.player1.id === currentUserId || match.partnership2.player2.id === currentUserId) {
      return 'team2';
    }
    return null;
  };

  useEffect(() => {
    fetchMatches();
  }, [leagueId, nightId]);

  if (loading) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading matches...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const activeMatches = matches.filter(m => m.status === 'active');
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header with Create Matches Button */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Current Matches
            </h2>
          </div>
          
          {isAdmin && (
            <button
              onClick={handleCreateMatches}
              disabled={creatingMatches}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-400 disabled:to-emerald-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              {creatingMatches ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span>Create Matches</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Active Matches */}
      {activeMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Now Playing</span>
          </h3>
          
          {activeMatches.map((match) => {
            const userTeam = getUserTeam(match);
            const isUserMatch = isUserInMatch(match);
            
            return (
              <div
                key={match.id}
                className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border ${
                  isUserMatch 
                    ? 'border-green-400 dark:border-green-500 ring-2 ring-green-200 dark:ring-green-800' 
                    : 'border-white/20 dark:border-slate-700/50'
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      Court {match.court_number}
                    </div>
                    {isUserMatch && (
                      <div className="bg-green-600 dark:bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Your Match
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Team 1 */}
                  <div className={`text-center p-4 rounded-xl ${
                    userTeam === 'team1' 
                      ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-400 dark:border-green-500' 
                      : 'bg-gray-50 dark:bg-slate-700/50'
                  }`}>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {match.partnership1.player1.full_name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      & {match.partnership1.player2.full_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {match.partnership1.player1.skill_level} • {match.partnership1.player2.skill_level}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">VS</div>
                  </div>

                  {/* Team 2 */}
                  <div className={`text-center p-4 rounded-xl ${
                    userTeam === 'team2' 
                      ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-400 dark:border-green-500' 
                      : 'bg-gray-50 dark:bg-slate-700/50'
                  }`}>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {match.partnership2.player1.full_name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      & {match.partnership2.player2.full_name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {match.partnership2.player1.skill_level} • {match.partnership2.player2.skill_level}
                    </div>
                  </div>
                </div>

                {isUserMatch && (
                  <ScoreSubmission
                    match={match}
                    currentUserId={currentUserId!}
                    leagueId={leagueId}
                    nightId={nightId}
                    onScoreSubmitted={fetchMatches}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Matches */}
      {completedMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span>Completed Games</span>
          </h3>
          
          {completedMatches.slice(0, 5).map((match) => (
            <div
              key={match.id}
              className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Court {match.court_number} • Completed
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {match.team1_score} - {match.team2_score}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {match.partnership1.player1.full_name} & {match.partnership1.player2.full_name}
                  </div>
                </div>
                <div className="text-center text-gray-400">vs</div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {match.partnership2.player1.full_name} & {match.partnership2.player2.full_name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Queue Information */}
      {queueInfo && queueInfo.partnershipsWaiting > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-700/50">
          <div className="flex items-center space-x-3 mb-3">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
              Partnerships Waiting
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-amber-800 dark:text-amber-300">
              <span className="font-semibold">{queueInfo.partnershipsWaiting} partnership{queueInfo.partnershipsWaiting === 1 ? '' : 's'}</span> 
              {' '}waiting for available courts
            </p>
            
            {queueInfo.message && (
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {queueInfo.message}
              </p>
            )}
            
            {queueInfo.details && (
              <div className="mt-3 p-3 bg-amber-100 dark:bg-amber-800/30 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-amber-700 dark:text-amber-300">Courts Available:</span>
                    <span className="ml-2 font-medium text-amber-900 dark:text-amber-200">
                      {queueInfo.details.courtsAvailable || 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-amber-700 dark:text-amber-300">Courts In Use:</span>
                    <span className="ml-2 font-medium text-amber-900 dark:text-amber-200">
                      {queueInfo.details.courtsInUse || 0}
                    </span>
                  </div>
                  {queueInfo.details.totalCourts && (
                    <div className="col-span-2">
                      <span className="text-amber-700 dark:text-amber-300">Total Courts:</span>
                      <span className="ml-2 font-medium text-amber-900 dark:text-amber-200">
                        {queueInfo.details.totalCourts}
                      </span>
                    </div>
                  )}
                </div>
                
                {queueInfo.details.nextMatchPossible && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    ✅ Next match can be created when a court becomes available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Matches State */}
      {matches.length === 0 && (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Matches Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Once partnerships are formed, matches will be created automatically.
            </p>
            {isAdmin && (
              <button
                onClick={handleCreateMatches}
                disabled={creatingMatches}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
              >
                Create First Matches
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesDisplay;