import React, { useMemo, useState } from 'react';
import { 
  UserCheck, 
  UserPlus, 
  Heart, 
  UserMinus, 
  CheckCircle, 
  Clock,
  Trophy,
  Target,
  Send,
  Check,
  X,
  Search
} from 'lucide-react';
import ScoreSubmission from '../ScoreSubmission';
import type { CheckedInPlayer, PartnershipRequest, ConfirmedPartnership } from '../../services/api/leagueNights';

interface Match {
  id: number;
  court_number: number;
  court_label?: string;
  status: 'active' | 'completed' | 'cancelled';
  team1_score?: number;
  team2_score?: number;
  created_at: string;
  completed_at?: string;
  partnership1: {
    id: number;
    player1: { id: string; first_name: string; last_name: string; skill_level: string };
    player2: { id: string; first_name: string; last_name: string; skill_level: string };
  };
  partnership2: {
    id: number;
    player1: { id: string; first_name: string; last_name: string; skill_level: string };
    player2: { id: string; first_name: string; last_name: string; skill_level: string };
  };
}

interface MyNightTabProps {
  user: any;
  leagueId: string;
  nightId: string;
  isCheckedIn: boolean;
  checkedInPlayers: CheckedInPlayer[];
  partnershipRequests: PartnershipRequest[];
  confirmedPartnership: ConfirmedPartnership | null;
  currentPartner: { id: string; name: string; skillLevel: string } | null;
  currentMatch: Match | null;
  checkingIn: boolean;
  unchecking: boolean;
  sendingRequest: string | null;
  acceptingRequest: number | null;
  rejectingRequest: number | null;
  removingPartnership: boolean;
  onCheckIn: () => void;
  onUncheck: () => void;
  onSendPartnershipRequest: (partnerId: string) => void;
  onAcceptPartnershipRequest: (requestId: number) => void;
  onRejectPartnershipRequest: (requestId: number) => void;
  onRemovePartnership: () => void;
  onScoreSubmitted: () => void;
}

const MyNightTab: React.FC<MyNightTabProps> = ({
  user,
  leagueId,
  nightId,
  isCheckedIn,
  checkedInPlayers,
  partnershipRequests,
  confirmedPartnership,
  currentPartner,
  currentMatch,
  checkingIn,
  unchecking,
  sendingRequest,
  acceptingRequest,
  rejectingRequest,
  removingPartnership,
  onCheckIn,
  onUncheck,
  onSendPartnershipRequest,
  onAcceptPartnershipRequest,
  onRejectPartnershipRequest,
  onRemovePartnership,
  onScoreSubmitted
}) => {
  const [partnerSearch, setPartnerSearch] = useState('');

  // Get available partners (checked in + no partner)
  const availablePartners = useMemo(() => {
    const available = checkedInPlayers.filter(player => 
      player.id !== user?.id && !player.hasPartner
    );
    
    // Filter by search term
    if (partnerSearch.trim()) {
      const searchLower = partnerSearch.toLowerCase();
      return available.filter(player => 
        player.name.toLowerCase().includes(searchLower) ||
        player.skillLevel.toLowerCase().includes(searchLower)
      );
    }
    
    return available;
  }, [checkedInPlayers, user?.id, partnerSearch]);

  // Get incoming and outgoing partnership requests
  const incomingRequests = useMemo(() => {
    return partnershipRequests.filter(req => 
      req.status === 'pending' && req.requested_id === user?.id
    );
  }, [partnershipRequests, user?.id]);

  const outgoingRequests = useMemo(() => {
    return partnershipRequests.filter(req => 
      req.status === 'pending' && req.requester_id === user?.id
    );
  }, [partnershipRequests, user?.id]);

  const hasSentRequest = (partnerId: string) => {
    return outgoingRequests.some(req => req.requested_id === partnerId);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Check-in Card */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Check-In Status
        </h2>
        
        {isCheckedIn ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">You're checked in!</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {currentPartner ? "Great! You're all set for tonight." : "Find a partner below to get started!"}
            </p>
            <button
              onClick={onUncheck}
              disabled={unchecking}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {unchecking ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700 dark:border-slate-200"></div>
                  Checking out...
                </>
              ) : (
                <>
                  <UserMinus className="w-5 h-5" />
                  Check Out
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={onCheckIn}
            disabled={checkingIn}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkingIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Checking in...
              </>
            ) : (
              <>
                <UserPlus className="w-6 h-6" />
                Check In to Join Tonight's Games
              </>
            )}
          </button>
        )}
      </div>

      {!isCheckedIn && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <p className="text-amber-800 dark:text-amber-200 text-center font-medium">
            Check in to join tonight's games and find a partner!
          </p>
        </div>
      )}

      {isCheckedIn && (
        <>
          {/* Partnership Widget */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              Partnership
              {incomingRequests.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {incomingRequests.length}
                </span>
              )}
            </h2>

            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <div className="mb-4 space-y-2">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Incoming Requests
                </h3>
                {incomingRequests.map(request => (
                  <div 
                    key={request.id}
                    className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {request.requester.first_name} {request.requester.last_name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {request.requester.skill_level}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onAcceptPartnershipRequest(request.id)}
                        disabled={acceptingRequest === request.id}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 font-medium min-w-[90px] justify-center"
                      >
                        {acceptingRequest === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => onRejectPartnershipRequest(request.id)}
                        disabled={rejectingRequest === request.id}
                        className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                        title="Decline"
                      >
                        {rejectingRequest === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700 dark:border-slate-200"></div>
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Current Partner or Partner Selection */}
            {currentPartner ? (
              <div className="space-y-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Your Partner</p>
                  <p className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">
                    {currentPartner.name}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    {currentPartner.skillLevel}
                  </p>
                </div>
                <button
                  onClick={onRemovePartnership}
                  disabled={removingPartnership}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {removingPartnership ? 'Removing...' : 'Remove Partnership'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {outgoingRequests.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Pending Request Sent To:
                    </p>
                    {outgoingRequests.map(req => (
                      <p key={req.id} className="text-blue-900 dark:text-blue-100 font-semibold">
                        {req.requested.first_name} {req.requested.last_name}
                      </p>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Available Partners</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {availablePartners.length} available
                    </span>
                  </h3>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or skill level..."
                      value={partnerSearch}
                      onChange={(e) => setPartnerSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  
                  {availablePartners.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                      No available partners yet. More players may check in soon!
                    </p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {availablePartners.map(player => {
                        const requestSent = hasSentRequest(player.id);
                        return (
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
                            <button
                              onClick={() => onSendPartnershipRequest(player.id)}
                              disabled={sendingRequest === player.id || requestSent}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:bg-slate-400 flex items-center gap-1 text-sm font-medium"
                            >
                              {sendingRequest === player.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : requestSent ? (
                                <>
                                  <Clock className="w-4 h-4" />
                                  Sent
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Request
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                    Don't see your partner? They may already be paired or not checked in yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Current Match Status */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              Your Match
            </h2>
            
            {currentMatch ? (
              <div className="space-y-4">
                {/* Match Info */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {currentMatch.court_label || `Court ${currentMatch.court_number}`}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      Active
                    </div>
                  </div>

                  {/* Teams Display */}
                  <div className="grid grid-cols-3 gap-3 items-center">
                    {/* Your Team */}
                    <div className="text-center bg-white dark:bg-slate-800 rounded-lg p-3">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">YOUR TEAM</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {`${currentMatch.partnership1.player1.first_name} ${currentMatch.partnership1.player1.last_name}`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentMatch.partnership1.player1.skill_level}
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                        {`${currentMatch.partnership1.player2.first_name} ${currentMatch.partnership1.player2.last_name}`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentMatch.partnership1.player2.skill_level}
                      </p>
                    </div>

                    {/* VS */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-400 dark:text-slate-500">VS</p>
                    </div>

                    {/* Opponent Team */}
                    <div className="text-center bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">OPPONENTS</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {`${currentMatch.partnership2.player1.first_name} ${currentMatch.partnership2.player1.last_name}`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentMatch.partnership2.player1.skill_level}
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                        {`${currentMatch.partnership2.player2.first_name} ${currentMatch.partnership2.player2.last_name}`}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {currentMatch.partnership2.player2.skill_level}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Submission */}
                <div>
                  <ScoreSubmission
                    match={currentMatch}
                    currentUserId={user?.id || ''}
                    leagueId={leagueId}
                    nightId={nightId}
                    onScoreSubmitted={onScoreSubmitted}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">
                  {!currentPartner 
                    ? "Find a partner to join the queue" 
                    : "Waiting for match assignment..."}
                </p>
              </div>
            )}
          </div>

          {/* Tonight's Stats - Placeholder */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Tonight's Stats
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Games</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">0</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Points</p>
              </div>
            </div>
          </div>

          {/* Completed Matches - Placeholder */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              Your Completed Matches
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
              No matches completed yet tonight
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MyNightTab;
