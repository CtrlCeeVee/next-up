import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, StopCircle, Edit, Users, BarChart, Plus, X, Trophy, AlertTriangle, ChevronDown, ChevronUp, Search, UserPlus } from 'lucide-react';
import TestingPanel from '../admin/TestingPanel';
import { leagueNightService } from '../../services/api/leagueNights';

interface AdminTabProps {
  leagueNight: {
    id: number;
    status: string;
    backendStatus?: string;
    courtsAvailable?: number;
    courtLabels?: string[];
    autoAssignmentEnabled?: boolean;
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

  // Match management state
  const [activeMatches, setActiveMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [overrideTeam1Score, setOverrideTeam1Score] = useState('');
  const [overrideTeam2Score, setOverrideTeam2Score] = useState('');
  const [overriding, setOverriding] = useState(false);
  const [overrideError, setOverrideError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<number | null>(null);

  // Manual assignment state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [waitingPartnerships, setWaitingPartnerships] = useState<any[]>([]);
  const [selectedPartnership1, setSelectedPartnership1] = useState('');
  const [selectedPartnership2, setSelectedPartnership2] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Auto-assignment toggle state
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(leagueNight.autoAssignmentEnabled !== false);
  const [togglingAutoAssignment, setTogglingAutoAssignment] = useState(false);

  // Dev tools collapse state
  const [devToolsExpanded, setDevToolsExpanded] = useState(false);

  // Admin check-in/check-out state
  const [leagueMembers, setLeagueMembers] = useState<any[]>([]);
  const [checkedInPlayers, setCheckedInPlayers] = useState<any[]>([]);
  const [selectedPlayerToCheckIn, setSelectedPlayerToCheckIn] = useState('');
  const [selectedPlayerToCheckOut, setSelectedPlayerToCheckOut] = useState('');
  const [checkingInPlayer, setCheckingInPlayer] = useState(false);
  const [checkingOutPlayer, setCheckingOutPlayer] = useState(false);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const [checkOutError, setCheckOutError] = useState<string | null>(null);
  const [checkInSearch, setCheckInSearch] = useState('');
  const [checkOutSearch, setCheckOutSearch] = useState('');
  const [showCheckInDropdown, setShowCheckInDropdown] = useState(false);
  const [showCheckOutDropdown, setShowCheckOutDropdown] = useState(false);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);

  // Admin partnership management state
  const [activePartnerships, setActivePartnerships] = useState<any[]>([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState('');
  const [selectedPlayer2, setSelectedPlayer2] = useState('');
  const [creatingPartnership, setCreatingPartnership] = useState(false);
  const [removingPartnership, setRemovingPartnership] = useState<number | null>(null);
  const [partnershipError, setPartnershipError] = useState<string | null>(null);
  const [player1Search, setPlayer1Search] = useState('');
  const [player2Search, setPlayer2Search] = useState('');
  const [showPlayer1Dropdown, setShowPlayer1Dropdown] = useState(false);
  const [showPlayer2Dropdown, setShowPlayer2Dropdown] = useState(false);
  const player1Ref = useRef<HTMLDivElement>(null);
  const player2Ref = useRef<HTMLDivElement>(null);

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

  // Fetch active matches
  const fetchActiveMatches = async () => {
    try {
      setLoadingMatches(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/matches`);
      const data = await response.json();
      if (data.success) {
        setActiveMatches(data.data.filter((m: any) => m.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Open override modal
  const handleOpenOverride = (match: any) => {
    setSelectedMatch(match);
    setOverrideTeam1Score(match.team1_score?.toString() || match.pending_team1_score?.toString() || '');
    setOverrideTeam2Score(match.team2_score?.toString() || match.pending_team2_score?.toString() || '');
    setOverrideError(null);
    setShowOverrideModal(true);
  };

  // Override match score
  const handleOverrideScore = async () => {
    if (!selectedMatch || !userId) return;

    const team1Score = parseInt(overrideTeam1Score);
    const team2Score = parseInt(overrideTeam2Score);

    if (isNaN(team1Score) || isNaN(team2Score)) {
      setOverrideError('Please enter valid scores');
      return;
    }

    if (team1Score < 0 || team2Score < 0) {
      setOverrideError('Scores cannot be negative');
      return;
    }

    try {
      setOverriding(true);
      setOverrideError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/matches/${selectedMatch.id}/override-score`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            team1_score: team1Score,
            team2_score: team2Score
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowOverrideModal(false);
        setSelectedMatch(null);
        onRefresh();
        fetchActiveMatches();
      } else {
        setOverrideError(data.error || 'Failed to override score');
      }
    } catch (error) {
      setOverrideError(error instanceof Error ? error.message : 'Failed to override score');
    } finally {
      setOverriding(false);
    }
  };

  // Cancel active match
  const handleCancelMatch = async (matchId: number) => {
    if (!userId || !confirm('Are you sure you want to cancel this match? The partnerships will return to the queue.')) {
      return;
    }

    try {
      setCancelling(matchId);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/matches/${matchId}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        }
      );

      const data = await response.json();
      if (data.success) {
        onRefresh();
        fetchActiveMatches();
        fetchWaitingPartnerships();
      } else {
        alert(data.error || 'Failed to cancel match');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to cancel match');
    } finally {
      setCancelling(null);
    }
  };

  // Fetch waiting partnerships for manual assignment
  const fetchWaitingPartnerships = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/queue`);
      const data = await response.json();
      if (data.success && data.data.queue) {
        setWaitingPartnerships(data.data.queue);
      }
    } catch (error) {
      console.error('Error fetching waiting partnerships:', error);
    }
  };

  // Open manual assignment modal
  const handleOpenAssignment = () => {
    fetchWaitingPartnerships();
    setAssignError(null);
    setSelectedPartnership1('');
    setSelectedPartnership2('');
    setSelectedCourt('');
    setShowAssignModal(true);
  };

  // Manual court assignment
  const handleAssignMatch = async () => {
    if (!userId || !selectedPartnership1 || !selectedPartnership2 || !selectedCourt) {
      setAssignError('Please select both partnerships and a court');
      return;
    }

    if (selectedPartnership1 === selectedPartnership2) {
      setAssignError('Cannot assign a partnership to play against itself');
      return;
    }

    try {
      setAssigning(true);
      setAssignError(null);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/matches/assign`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            partnership1_id: parseInt(selectedPartnership1),
            partnership2_id: parseInt(selectedPartnership2),
            court_number: parseInt(selectedCourt)
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setShowAssignModal(false);
        onRefresh();
        fetchActiveMatches();
        fetchWaitingPartnerships();
      } else {
        setAssignError(data.error || 'Failed to assign match');
      }
    } catch (error) {
      setAssignError(error instanceof Error ? error.message : 'Failed to assign match');
    } finally {
      setAssigning(false);
    }
  };

  // Load matches when component mounts or when showing override section
  useEffect(() => {
    if (isActive) {
      fetchActiveMatches();
    }
  }, [isActive, leagueId, nightId]);

  // Fetch league members and checked-in players
  useEffect(() => {
    fetchLeagueMembersAndCheckedIn();
  }, [leagueId, leagueNight.id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (checkInRef.current && !checkInRef.current.contains(event.target as Node)) {
        setShowCheckInDropdown(false);
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target as Node)) {
        setShowCheckOutDropdown(false);
      }
      if (player1Ref.current && !player1Ref.current.contains(event.target as Node)) {
        setShowPlayer1Dropdown(false);
      }
      if (player2Ref.current && !player2Ref.current.contains(event.target as Node)) {
        setShowPlayer2Dropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchLeagueMembersAndCheckedIn = async () => {
    try {
      // Fetch league members
      const membersResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/leagues/${leagueId}/members`);
      const membersData = await membersResponse.json();
      if (membersData.success) {
        setLeagueMembers(membersData.data || []);
      }

      // Fetch checked-in players (includes partnership info)
      const checkedInResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/leagues/${leagueId}/nights/${nightId}/checkins`);
      const checkedInData = await checkedInResponse.json();
      if (checkedInData.success) {
        setCheckedInPlayers(checkedInData.data || []);
      }

      // Fetch all active partnerships via API
      const partnershipsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/leagues/${leagueId}/nights/${nightId}/partnerships`);
      const partnershipsData = await partnershipsResponse.json();
      if (partnershipsData.success) {
        setActivePartnerships(partnershipsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching league data:', error);
    }
  };

  const handleAdminCheckIn = async () => {
    if (!userId || !selectedPlayerToCheckIn) return;

    setCheckingInPlayer(true);
    setCheckInError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/admin/checkin-player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_user_id: userId,
          player_user_id: selectedPlayerToCheckIn
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedPlayerToCheckIn('');
        setCheckInSearch('');
        setShowCheckInDropdown(false);
        fetchLeagueMembersAndCheckedIn();
        onRefresh();
      } else {
        setCheckInError(data.error || 'Failed to check in player');
      }
    } catch (error) {
      setCheckInError(error instanceof Error ? error.message : 'Failed to check in player');
    } finally {
      setCheckingInPlayer(false);
    }
  };

  const handleAdminCheckOut = async () => {
    if (!userId || !selectedPlayerToCheckOut) return;

    setCheckingOutPlayer(true);
    setCheckOutError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/admin/checkout-player`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_user_id: userId,
          player_user_id: selectedPlayerToCheckOut
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedPlayerToCheckOut('');
        setCheckOutSearch('');
        setShowCheckOutDropdown(false);
        fetchLeagueMembersAndCheckedIn();
        onRefresh();
      } else {
        setCheckOutError(data.error || 'Failed to check out player');
      }
    } catch (error) {
      setCheckOutError(error instanceof Error ? error.message : 'Failed to check out player');
    } finally {
      setCheckingOutPlayer(false);
    }
  };

  const getSelectedPlayerName = (playerId: string, playerList: any[]) => {
    const player = playerList.find(p => p.id === playerId);
    return player?.name || 'Select player...';
  };

  const handleAdminCreatePartnership = async () => {
    if (!userId || !selectedPlayer1 || !selectedPlayer2) return;

    if (selectedPlayer1 === selectedPlayer2) {
      setPartnershipError('Cannot partner a player with themselves');
      return;
    }

    setCreatingPartnership(true);
    setPartnershipError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/admin/create-partnership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_user_id: userId,
          player1_id: selectedPlayer1,
          player2_id: selectedPlayer2
        })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedPlayer1('');
        setSelectedPlayer2('');
        setPlayer1Search('');
        setPlayer2Search('');
        setShowPlayer1Dropdown(false);
        setShowPlayer2Dropdown(false);
        fetchLeagueMembersAndCheckedIn();
        onRefresh();
      } else {
        setPartnershipError(data.error || 'Failed to create partnership');
      }
    } catch (error) {
      setPartnershipError(error instanceof Error ? error.message : 'Failed to create partnership');
    } finally {
      setCreatingPartnership(false);
    }
  };

  const handleAdminRemovePartnership = async (partnershipId: number) => {
    if (!userId) return;

    setRemovingPartnership(partnershipId);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/admin/remove-partnership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_user_id: userId,
          partnership_id: partnershipId
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchLeagueMembersAndCheckedIn();
        onRefresh();
      } else {
        alert(data.error || 'Failed to remove partnership');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove partnership');
    } finally {
      setRemovingPartnership(null);
    }
  };

  // Toggle auto-assignment
  const handleToggleAutoAssignment = async () => {
    if (!userId) return;

    try {
      setTogglingAutoAssignment(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/toggle-auto-assignment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            enabled: !autoAssignmentEnabled
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        setAutoAssignmentEnabled(!autoAssignmentEnabled);
        onRefresh();
        if (!autoAssignmentEnabled) {
          // If turning on, refresh matches to show new auto-assignments
          fetchActiveMatches();
        }
      } else {
        alert(data.error || 'Failed to toggle auto-assignment');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to toggle auto-assignment');
    } finally {
      setTogglingAutoAssignment(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 overflow-visible">
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
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg overflow-visible">
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
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg overflow-visible">
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
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg overflow-visible">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Match Management
        </h3>
        
        <div className="space-y-4">
          {/* Auto-Assignment Toggle */}
          {isActive && (
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white mb-1">Auto-Assignment</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {autoAssignmentEnabled 
                      ? 'Matches are automatically created when partnerships and courts are available' 
                      : 'Manual assignment only - use the button below to create matches'}
                  </p>
                </div>
                <button
                  onClick={handleToggleAutoAssignment}
                  disabled={togglingAutoAssignment}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    autoAssignmentEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoAssignmentEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Active Matches List */}
          {loadingMatches ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : activeMatches.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {activeMatches.length} active {activeMatches.length === 1 ? 'match' : 'matches'}
              </p>
              {activeMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {match.court_label || `Court ${match.court_number}`}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {match.partnership1.player1.first_name} & {match.partnership1.player2.first_name} vs {match.partnership2.player1.first_name} & {match.partnership2.player2.first_name}
                    </p>
                    {(match.team1_score !== null || match.pending_team1_score !== null) && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Score: {match.team1_score ?? match.pending_team1_score} - {match.team2_score ?? match.pending_team2_score}
                        {match.score_status === 'pending' && ' (Pending)'}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenOverride(match)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      Override Score
                    </button>
                    <button
                      onClick={() => handleCancelMatch(match.id)}
                      disabled={cancelling === match.id}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed dark:disabled:bg-slate-600 text-white disabled:text-slate-500 text-xs rounded-lg transition-colors whitespace-nowrap"
                    >
                      {cancelling === match.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              No active matches
            </div>
          )}
          
          <button
            onClick={fetchActiveMatches}
            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium text-sm"
          >
            Refresh Matches
          </button>

          {/* Manual Court Assignment Button */}
          {isActive && (
            <button
              onClick={handleOpenAssignment}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all font-medium text-sm shadow-md"
            >
              Manual Court Assignment
            </button>
          )}
        </div>
      </div>

      {/* Override Score Modal */}
      {showOverrideModal && selectedMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                Override Match Score
              </h3>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  Admin override will finalize the match with these scores and trigger auto-assignment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Team 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {selectedMatch.partnership1.player1.first_name} & {selectedMatch.partnership1.player2.first_name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={overrideTeam1Score}
                  onChange={(e) => setOverrideTeam1Score(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {/* Team 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {selectedMatch.partnership2.player1.first_name} & {selectedMatch.partnership2.player2.first_name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={overrideTeam2Score}
                  onChange={(e) => setOverrideTeam2Score(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              {overrideError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
                  <p className="text-sm text-red-800 dark:text-red-300">{overrideError}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleOverrideScore}
                  disabled={overriding}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                >
                  {overriding ? 'Overriding...' : 'Override Score'}
                </button>
                <button
                  onClick={() => setShowOverrideModal(false)}
                  disabled={overriding}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg overflow-visible">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Player Management
        </h3>
        <div className="space-y-4">
          {/* Admin Check-in */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Check In Player
            </label>
            <div className="flex gap-2">
              {/* Custom Searchable Dropdown */}
              <div ref={checkInRef} className="flex-1 relative">
                <button
                  onClick={() => setShowCheckInDropdown(!showCheckInDropdown)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-left flex items-center justify-between"
                >
                  <span className={selectedPlayerToCheckIn ? '' : 'text-slate-400'}>
                    {getSelectedPlayerName(selectedPlayerToCheckIn, leagueMembers.filter(m => !checkedInPlayers.some(p => p.id === m.id)))}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCheckInDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-600">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={checkInSearch}
                          onChange={(e) => setCheckInSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-600 dark:text-white text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {leagueMembers
                        .filter(member => !checkedInPlayers.some(p => p.id === member.id))
                        .filter(member => 
                          checkInSearch === '' || 
                          member.name.toLowerCase().includes(checkInSearch.toLowerCase())
                        )
                        .map((member) => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setSelectedPlayerToCheckIn(member.id);
                              setShowCheckInDropdown(false);
                              setCheckInSearch('');
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors dark:text-white"
                          >
                            {member.name}
                          </button>
                        ))}
                      {leagueMembers.filter(member => !checkedInPlayers.some(p => p.id === member.id) && (checkInSearch === '' || member.name.toLowerCase().includes(checkInSearch.toLowerCase()))).length === 0 && (
                        <div className="px-3 py-4 text-center text-slate-400 text-sm">
                          No players found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAdminCheckIn}
                disabled={checkingInPlayer || !selectedPlayerToCheckIn}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                {checkingInPlayer ? 'Checking In...' : 'Check In'}
              </button>
            </div>
            {checkInError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{checkInError}</p>
            )}
          </div>

          {/* Admin Check-out */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Check Out Player
            </label>
            <div className="flex gap-2">
              {/* Custom Searchable Dropdown */}
              <div ref={checkOutRef} className="flex-1 relative">
                <button
                  onClick={() => setShowCheckOutDropdown(!showCheckOutDropdown)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-left flex items-center justify-between"
                >
                  <span className={selectedPlayerToCheckOut ? '' : 'text-slate-400'}>
                    {getSelectedPlayerName(selectedPlayerToCheckOut, checkedInPlayers)}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showCheckOutDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-600">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={checkOutSearch}
                          onChange={(e) => setCheckOutSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-600 dark:text-white text-sm"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {checkedInPlayers
                        .filter(player => 
                          checkOutSearch === '' || 
                          (player.name && player.name.toLowerCase().includes(checkOutSearch.toLowerCase()))
                        )
                        .map((player) => (
                          <button
                            key={player.id}
                            onClick={() => {
                              setSelectedPlayerToCheckOut(player.id);
                              setShowCheckOutDropdown(false);
                              setCheckOutSearch('');
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors dark:text-white"
                          >
                            {player.name || 'Unknown Player'}
                          </button>
                        ))}
                      {checkedInPlayers.filter(player => checkOutSearch === '' || (player.name && player.name.toLowerCase().includes(checkOutSearch.toLowerCase()))).length === 0 && (
                        <div className="px-3 py-4 text-center text-slate-400 text-sm">
                          No players found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAdminCheckOut}
                disabled={checkingOutPlayer || !selectedPlayerToCheckOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-lg transition-colors font-medium whitespace-nowrap"
              >
                {checkingOutPlayer ? 'Checking Out...' : 'Check Out'}
              </button>
            </div>
            {checkOutError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{checkOutError}</p>
            )}
          </div>

          <button
            disabled
            className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg opacity-50 cursor-not-allowed font-medium text-left"
          >
            Mark No-Show (Coming Soon)
          </button>
        </div>
      </div>

      {/* Partnership Management */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg overflow-visible">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Partnership Management
        </h3>
        <div className="space-y-6">
          {/* Create Partnership */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
              Create Partnership
            </h4>
            
            <div className="flex gap-3">
              {/* Player 1 Dropdown */}
              <div ref={player1Ref} className="flex-1 relative">
                <button
                  onClick={() => setShowPlayer1Dropdown(!showPlayer1Dropdown)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-left flex items-center justify-between hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors"
                >
                  <span className="text-slate-700 dark:text-slate-200">
                    {selectedPlayer1 
                      ? getSelectedPlayerName(selectedPlayer1, checkedInPlayers) 
                      : 'Select Player 1'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPlayer1Dropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPlayer1Dropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search players..."
                          value={player1Search}
                          onChange={(e) => setPlayer1Search(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto">
                      {checkedInPlayers
                        .filter(p => 
                          p.name.toLowerCase().includes(player1Search.toLowerCase()) &&
                          p.id !== selectedPlayer2 // Can't select same player
                        )
                        .map(player => (
                          <button
                            key={player.id}
                            onClick={() => {
                              setSelectedPlayer1(player.id);
                              setShowPlayer1Dropdown(false);
                              setPlayer1Search('');
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            {player.name}
                          </button>
                        ))}
                      {checkedInPlayers.filter(p => 
                        p.name.toLowerCase().includes(player1Search.toLowerCase()) &&
                        p.id !== selectedPlayer2
                      ).length === 0 && (
                        <div className="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                          No players found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Player 2 Dropdown */}
              <div ref={player2Ref} className="flex-1 relative">
                <button
                  onClick={() => setShowPlayer2Dropdown(!showPlayer2Dropdown)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-left flex items-center justify-between hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors"
                >
                  <span className="text-slate-700 dark:text-slate-200">
                    {selectedPlayer2 
                      ? getSelectedPlayerName(selectedPlayer2, checkedInPlayers) 
                      : 'Select Player 2'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPlayer2Dropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showPlayer2Dropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search players..."
                          value={player2Search}
                          onChange={(e) => setPlayer2Search(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-44 overflow-y-auto">
                      {checkedInPlayers
                        .filter(p => 
                          p.name.toLowerCase().includes(player2Search.toLowerCase()) &&
                          p.id !== selectedPlayer1 // Can't select same player
                        )
                        .map(player => (
                          <button
                            key={player.id}
                            onClick={() => {
                              setSelectedPlayer2(player.id);
                              setShowPlayer2Dropdown(false);
                              setPlayer2Search('');
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            {player.name}
                          </button>
                        ))}
                      {checkedInPlayers.filter(p => 
                        p.name.toLowerCase().includes(player2Search.toLowerCase()) &&
                        p.id !== selectedPlayer1
                      ).length === 0 && (
                        <div className="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
                          No players found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAdminCreatePartnership}
              disabled={!selectedPlayer1 || !selectedPlayer2 || creatingPartnership}
              className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {creatingPartnership ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Partnership...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Partnership
                </>
              )}
            </button>

            {partnershipError && (
              <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {partnershipError}
              </div>
            )}
          </div>

          {/* Active Partnerships List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
              Active Partnerships ({activePartnerships.length})
            </h4>
            
            {activePartnerships.length === 0 ? (
              <div className="text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-700/50 px-4 py-3 rounded-lg">
                No active partnerships
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {activePartnerships.map(partnership => {
                  const player1 = checkedInPlayers.find(p => p.id === partnership.player1_id);
                  const player2 = checkedInPlayers.find(p => p.id === partnership.player2_id);
                  return (
                    <div 
                      key={partnership.id}
                      className="flex items-center justify-between bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <span className="text-slate-700 dark:text-slate-200 font-medium">
                        {player1?.name || 'Unknown'} & {player2?.name || 'Unknown'}
                      </span>
                      <button
                        onClick={() => handleAdminRemovePartnership(partnership.id)}
                        disabled={removingPartnership !== null}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {removingPartnership === partnership.id ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports & Analytics */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg overflow-visible">
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

      {/* Testing Panel (Development Only) */}
      {import.meta.env.DEV && (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <button
            onClick={() => setDevToolsExpanded(!devToolsExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/40 dark:hover:bg-slate-700/40 transition-colors"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-500" />
              Development Tools
            </h3>
            {devToolsExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
          
          {devToolsExpanded && (
            <div className="px-6 pb-6">
              <TestingPanel 
                leagueNightId={leagueNight.id}
                leagueId={leagueId}
                onRefresh={onRefresh}
              />
            </div>
          )}
        </div>
      )}

      {/* Manual Court Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Manual Court Assignment
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Partnership 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Partnership 1
                </label>
                <select
                  value={selectedPartnership1}
                  onChange={(e) => setSelectedPartnership1(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select partnership...</option>
                  {waitingPartnerships.map((p) => (
                    <option key={p.partnership_id} value={p.partnership_id}>
                      {p.p1_full_name} & {p.p2_full_name} ({p.games_played_tonight} games)
                    </option>
                  ))}
                </select>
              </div>

              {/* Partnership 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Partnership 2
                </label>
                <select
                  value={selectedPartnership2}
                  onChange={(e) => setSelectedPartnership2(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select partnership...</option>
                  {waitingPartnerships.map((p) => (
                    <option key={p.partnership_id} value={p.partnership_id}>
                      {p.p1_full_name} & {p.p2_full_name} ({p.games_played_tonight} games)
                    </option>
                  ))}
                </select>
              </div>

              {/* Court Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Court
                </label>
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                >
                  <option value="">Select court...</option>
                  {Array.from({ length: leagueNight.courtsAvailable || 4 }, (_, i) => i + 1).map((courtNum) => (
                    <option key={courtNum} value={courtNum}>
                      {leagueNight.courtLabels?.[courtNum - 1] || `Court ${courtNum}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error Display */}
              {assignError && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{assignError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAssignModal(false)}
                  disabled={assigning}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignMatch}
                  disabled={assigning}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-lg transition-all font-medium shadow-md disabled:cursor-not-allowed"
                >
                  {assigning ? 'Assigning...' : 'Assign Match'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTab;
