import React, { useMemo } from 'react';
import { Users, Heart, Trophy, CheckCircle } from 'lucide-react';
import type { CheckedInPlayer } from '../../services/api/leagueNights';

interface LeagueInfoTabProps {
  checkedInPlayers: CheckedInPlayer[];
  leagueNight: {
    day: string;
    time: string;
    date: string;
    courtsAvailable: number;
  };
}

const LeagueInfoTab: React.FC<LeagueInfoTabProps> = ({
  checkedInPlayers,
  leagueNight
}) => {
  // Group players by partnership status
  const { paired, unpaired } = useMemo(() => {
    const paired = checkedInPlayers.filter(p => p.hasPartner);
    const unpaired = checkedInPlayers.filter(p => !p.hasPartner);
    return { paired, unpaired };
  }, [checkedInPlayers]);

  // Calculate partnership pairs (showing each partnership once)
  const partnerships = useMemo(() => {
    const pairs: Array<{ player1: CheckedInPlayer; player2: CheckedInPlayer }> = [];
    const processed = new Set<string>();

    paired.forEach(player => {
      if (processed.has(player.id)) return;
      
      const partner = paired.find(p => p.partnerId === player.id);
      if (partner) {
        pairs.push({ player1: player, player2: partner });
        processed.add(player.id);
        processed.add(partner.id);
      }
    });

    return pairs;
  }, [paired]);

  return (
    <div className="space-y-6 pb-24">
      {/* League Night Info */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          League Night Info
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Day</p>
            <p className="font-semibold text-slate-900 dark:text-white">{leagueNight.day}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
            <p className="font-semibold text-slate-900 dark:text-white">{leagueNight.time}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Date</p>
            <p className="font-semibold text-slate-900 dark:text-white">{leagueNight.date}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Courts</p>
            <p className="font-semibold text-slate-900 dark:text-white">{leagueNight.courtsAvailable}</p>
          </div>
        </div>
      </div>

      {/* Check-in Summary */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Check-In Summary
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{checkedInPlayers.length}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Players</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{partnerships.length}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Partnerships</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{unpaired.length}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Solo Players</p>
          </div>
        </div>
      </div>

      {/* Partnerships */}
      {partnerships.length > 0 && (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            Formed Partnerships
            <span className="ml-auto text-sm font-normal text-slate-600 dark:text-slate-400">
              {partnerships.length} {partnerships.length === 1 ? 'team' : 'teams'}
            </span>
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {partnerships.map((pair, index) => (
              <div 
                key={`${pair.player1.id}-${pair.player2.id}`}
                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {pair.player1.name} & {pair.player2.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {pair.player1.skillLevel} • {pair.player2.skillLevel}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Checked-In Players */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          All Players Tonight
          <span className="ml-auto text-sm font-normal text-slate-600 dark:text-slate-400">
            {checkedInPlayers.length} {checkedInPlayers.length === 1 ? 'player' : 'players'}
          </span>
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {checkedInPlayers.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              No players checked in yet
            </p>
          ) : (
            checkedInPlayers.map(player => (
              <div
                key={player.id}
                className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {player.name}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {player.skillLevel}
                  </p>
                </div>
                {player.hasPartner && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                    Paired
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tonight's Leaderboard - Placeholder */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          Tonight's Leaderboard
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 py-4">
          Leaderboard will appear once matches are completed
        </p>
      </div>
    </div>
  );
};

export default LeagueInfoTab;
