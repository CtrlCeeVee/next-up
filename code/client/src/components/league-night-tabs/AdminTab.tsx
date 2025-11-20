import React from 'react';
import { Settings, Play, StopCircle, Edit, Users, BarChart } from 'lucide-react';
import TestingPanel from '../admin/TestingPanel';

interface AdminTabProps {
  leagueNight: {
    id: number;
    status: string;
    backendStatus?: string;
  };
  leagueId: number;
  startingLeague: boolean;
  onStartLeague: () => void;
  onRefresh: () => void;
}

const AdminTab: React.FC<AdminTabProps> = ({
  leagueNight,
  leagueId,
  startingLeague,
  onStartLeague,
  onRefresh
}) => {
  const isActive = leagueNight.backendStatus === 'active' || leagueNight.status === 'active';
  const isScheduled = leagueNight.backendStatus === 'scheduled' || leagueNight.status === 'scheduled';

  return (
    <div className="space-y-6 pb-24">
      {/* Admin Controls Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Settings className="w-7 h-7" />
          Admin Controls
        </h2>
        <p className="text-purple-100">
          Manage league night operations and settings
        </p>
      </div>

      {/* League Night Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          League Night Status
        </h3>
        
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Current Status</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white capitalize">
              {leagueNight.backendStatus || leagueNight.status}
            </p>
          </div>

          {isScheduled && (
            <button
              onClick={onStartLeague}
              disabled={startingLeague}
              className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startingLeague ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Starting League Night...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Start League Night
                </>
              )}
            </button>
          )}

          {isActive && (
            <button
              disabled
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl opacity-50 cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <StopCircle className="w-6 h-6" />
              End League Night (Coming Soon)
            </button>
          )}
        </div>
      </div>

      {/* Match Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Match Management
        </h3>
        <div className="space-y-3">
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Override Match Scores (Coming Soon)
          </button>
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Manual Match Assignment (Coming Soon)
          </button>
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Reassign Court (Coming Soon)
          </button>
        </div>
      </div>

      {/* Player Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Player Management
        </h3>
        <div className="space-y-3">
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Mark No-Show (Coming Soon)
          </button>
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Force Check-Out Player (Coming Soon)
          </button>
        </div>
      </div>

      {/* Reports & Analytics */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Reports & Analytics
        </h3>
        <div className="space-y-3">
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Export Tonight's Data (Coming Soon)
          </button>
          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            View Full Statistics (Coming Soon)
          </button>
        </div>
      </div>

      {/* Testing Panel (Development) */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Development Tools
        </h3>
        <TestingPanel 
          leagueNightId={leagueNight.id}
          leagueId={leagueId}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
};

export default AdminTab;
