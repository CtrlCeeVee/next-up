import React, { useState } from 'react';
import { Settings, Play, StopCircle, Edit, Users, BarChart, Plus, X } from 'lucide-react';
import TestingPanel from '../admin/TestingPanel';
import { leagueNightService } from '../../services/api/leagueNights';

interface AdminTabProps {
  leagueNight: {
    id: number;
    status: string;
    backendStatus?: string;
    courtsAvailable?: number;
    courtLabels?: string[];
  };
  leagueId: number;
  nightId: string;
  userId?: string;
  startingLeague: boolean;
  endingLeague: boolean;
  onStartLeague: () => void;
  onEndLeague: () => void;
  onRefresh: () => void;
}

const AdminTab: React.FC<AdminTabProps> = ({
  leagueNight,
  leagueId,
  nightId,
  userId,
  startingLeague,
  endingLeague,
  onStartLeague,
  onEndLeague,
  onRefresh
}) => {
  const isActive = leagueNight.backendStatus === 'active' || leagueNight.status === 'active';
  const isScheduled = leagueNight.backendStatus === 'scheduled' || leagueNight.status === 'scheduled';
  const isCompleted = leagueNight.backendStatus === 'completed' || leagueNight.status === 'completed';

  const [courts, setCourts] = useState<string[]>(leagueNight.courtLabels || []);
  const [newCourtName, setNewCourtName] = useState('');
  const [savingCourts, setSavingCourts] = useState(false);
  const [courtError, setCourtError] = useState<string | null>(null);

  const handleAddCourt = () => {
    if (!newCourtName.trim()) {
      setCourtError('Court name cannot be empty');
      return;
    }
    if (courts.includes(newCourtName.trim())) {
      setCourtError('Court name already exists');
      return;
    }
    setCourts([...courts, newCourtName.trim()]);
    setNewCourtName('');
    setCourtError(null);
  };

  const handleRemoveCourt = (index: number) => {
    setCourts(courts.filter((_, i) => i !== index));
    setCourtError(null);
  };

  const handleSaveCourts = async () => {
    if (!userId) {
      setCourtError('User not authenticated');
      return;
    }

    if (courts.length === 0) {
      setCourtError('At least one court is required');
      return;
    }

    try {
      setSavingCourts(true);
      setCourtError(null);
      await leagueNightService.updateCourts(leagueId, nightId, userId, courts);
      onRefresh();
    } catch (error) {
      setCourtError(error instanceof Error ? error.message : 'Failed to update courts');
    } finally {
      setSavingCourts(false);
    }
  };

  const hasChanges = JSON.stringify(courts) !== JSON.stringify(leagueNight.courtLabels || []);

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
              onClick={onEndLeague}
              disabled={endingLeague}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {endingLeague ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Ending League Night...
                </>
              ) : (
                <>
                  <StopCircle className="w-6 h-6" />
                  End League Night
                </>
              )}
            </button>
          )}

          {isCompleted && (
            <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">League Night Ended</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                No new matches will be auto-assigned
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Court Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Court Management
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Add or remove courts as they become available during the night.
          </p>

          {/* Current Courts List */}
          <div className="space-y-2">
            {courts.map((court, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3"
              >
                <span className="font-medium text-slate-900 dark:text-white">{court}</span>
                <button
                  onClick={() => handleRemoveCourt(index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Remove court"
                >
                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Court */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newCourtName}
              onChange={(e) => setNewCourtName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCourt()}
              placeholder="Court name (e.g., Court 5)"
              className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm"
            />
            <button
              onClick={handleAddCourt}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1 whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Add</span>
            </button>
          </div>

          {/* Error Message */}
          {courtError && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{courtError}</p>
            </div>
          )}

          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={handleSaveCourts}
              disabled={savingCourts}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingCourts ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving Courts...
                </>
              ) : (
                'Save Court Changes'
              )}
            </button>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Note:</strong> Court changes take effect immediately. Active matches on removed courts will continue.
          </div>
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
