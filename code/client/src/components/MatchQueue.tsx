import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { API_BASE_URL } from '../services/api/base';

interface QueuePartnership {
  id: string;
  player1Name: string;
  player2Name: string;
  gamesPlayed: number;
  isCurrentlyPlaying: boolean;
}

interface QueueData {
  waitingPartnerships: QueuePartnership[];
  currentlyPlaying: QueuePartnership[];
  courtsAvailable: number;
  courtsInUse: number;
  totalCourts: number;
}

interface MatchQueueProps {
  leagueId: string;
  nightId: string;
}

export default function MatchQueue({ leagueId, nightId }: MatchQueueProps) {
  const [queueData, setQueueData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/leagues/${leagueId}/nights/${nightId}/queue`,
        { credentials: 'include' }
      );
      const data = await response.json();
      
      if (data.success) {
        setQueueData(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch queue');
      }
    } catch (err) {
      console.error('Error fetching queue:', err);
      setError('Failed to fetch queue information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();

    // Subscribe to real-time updates
    const matchesChannel = supabase
      .channel('queue-matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    const partnershipsChannel = supabase
      .channel('queue-partnerships')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'confirmed_partnerships'
        },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      matchesChannel.unsubscribe();
      partnershipsChannel.unsubscribe();
    };
  }, [leagueId, nightId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!queueData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Match Queue</h2>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Courts: {queueData.courtsInUse}/{queueData.totalCourts} in use</span>
          <span>•</span>
          <span>{queueData.courtsAvailable} available</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Currently Playing */}
        {queueData.currentlyPlaying.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Currently Playing ({queueData.currentlyPlaying.length})
            </h3>
            <div className="space-y-2">
              {queueData.currentlyPlaying.map((partnership) => (
                <div
                  key={partnership.id}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {partnership.player1Name} & {partnership.player2Name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {partnership.gamesPlayed} {partnership.gamesPlayed === 1 ? 'game' : 'games'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Waiting Queue */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Waiting ({queueData.waitingPartnerships.length})
          </h3>
          
          {queueData.waitingPartnerships.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No partnerships waiting</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queueData.waitingPartnerships.map((partnership, index) => (
                <div
                  key={partnership.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                      {partnership.player1Name} & {partnership.player2Name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 ml-9 sm:ml-0">
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {partnership.gamesPlayed} {partnership.gamesPlayed === 1 ? 'game' : 'games'}
                    </div>
                    {index === 0 && queueData.courtsAvailable > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded whitespace-nowrap">
                        Next up
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Message */}
        {queueData.waitingPartnerships.length > 0 && queueData.courtsAvailable === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Matches will be created automatically when courts become available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
