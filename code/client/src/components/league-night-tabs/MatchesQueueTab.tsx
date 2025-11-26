import React from 'react';
import { Trophy } from 'lucide-react';
import MatchesDisplay from '../MatchesDisplay';
import MatchQueue from '../MatchQueue';

interface MatchesQueueTabProps {
  leagueId: string;
  nightId: string;
  leagueNightInstanceId: number;
  leagueNightStatus: 'scheduled' | 'active' | 'completed';
  userId?: string;
  matchesRefreshTrigger: number;
  onMatchesCreated: () => void;
}

const MatchesQueueTab: React.FC<MatchesQueueTabProps> = ({
  leagueId,
  nightId,
  leagueNightInstanceId,
  leagueNightStatus,
  userId,
  matchesRefreshTrigger,
  onMatchesCreated
}) => {
  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          Active Matches & Queue
        </h2>
        
        {/* Matches Display */}
        <div className="mb-6">
          <MatchesDisplay 
            leagueId={leagueId}
            nightId={nightId}
            currentUserId={userId}
            leagueNightStatus={leagueNightStatus}
            refreshTrigger={matchesRefreshTrigger}
            onCreateMatches={onMatchesCreated}
          />
        </div>

        {/* Match Queue */}
        <div>
          <MatchQueue 
            leagueId={leagueId}
            nightId={nightId}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchesQueueTab;
