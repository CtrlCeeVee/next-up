import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { leagueNightService } from '../services/api/leagueNights';

interface Match {
  id: number;
  court_number: number;
  court_label?: string;
  status: 'active' | 'completed' | 'cancelled';
  pending_team1_score?: number;
  pending_team2_score?: number;
  pending_submitted_by_partnership_id?: number;
  score_status?: 'none' | 'pending' | 'confirmed' | 'disputed';
  partnership1: {
    id: number;
    player1: { id: string; first_name: string; last_name: string };
    player2: { id: string; first_name: string; last_name: string };
  };
  partnership2: {
    id: number;
    player1: { id: string; first_name: string; last_name: string };
    player2: { id: string; first_name: string; last_name: string };
  };
}

interface ScoreConfirmationProps {
  match: Match;
  currentUserId: string;
  leagueId: number;
  nightId: string;
  onConfirmed: () => void;
  onDisputed: () => void;
}

const ScoreConfirmation: React.FC<ScoreConfirmationProps> = ({
  match,
  currentUserId,
  leagueId,
  nightId,
  onConfirmed,
  onDisputed
}) => {
  const [confirming, setConfirming] = useState(false);
  const [disputing, setDisputing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if current user is in the match
  const isUserInMatch = 
    match.partnership1.player1.id === currentUserId ||
    match.partnership1.player2.id === currentUserId ||
    match.partnership2.player1.id === currentUserId ||
    match.partnership2.player2.id === currentUserId;

  // Determine user's partnership
  const isUserTeam1 = 
    match.partnership1.player1.id === currentUserId ||
    match.partnership1.player2.id === currentUserId;

  const userPartnershipId = isUserTeam1 ? match.partnership1.id : match.partnership2.id;

  // Only show if there's a pending score and user didn't submit it
  if (
    !isUserInMatch || 
    match.score_status !== 'pending' || 
    match.pending_submitted_by_partnership_id === userPartnershipId
  ) {
    return null;
  }

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);

    try {
      await leagueNightService.confirmMatchScore(leagueId, nightId, match.id, currentUserId);
      onConfirmed();
    } catch (err) {
      console.error('Error confirming score:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm score');
    } finally {
      setConfirming(false);
    }
  };

  const handleDispute = async () => {
    setDisputing(true);
    setError(null);

    try {
      await leagueNightService.disputeMatchScore(leagueId, nightId, match.id, currentUserId);
      onDisputed();
    } catch (err) {
      console.error('Error disputing score:', err);
      setError(err instanceof Error ? err.message : 'Failed to dispute score');
    } finally {
      setDisputing(false);
    }
  };

  // Determine who submitted the score
  const submittingTeamName = match.pending_submitted_by_partnership_id === match.partnership1.id
    ? `${match.partnership1.player1.first_name} & ${match.partnership1.player2.first_name}`
    : `${match.partnership2.player1.first_name} & ${match.partnership2.player2.first_name}`;

  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
            Score Needs Confirmation
          </h4>
          <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-3">
            {submittingTeamName} submitted: <span className="font-bold">{match.pending_team1_score}-{match.pending_team2_score}</span>
          </p>

          {error && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-700">
              <p className="text-xs text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleConfirm}
              disabled={confirming || disputing}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              {confirming ? (
                <span>Confirming...</span>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Confirm</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleDispute}
              disabled={confirming || disputing}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              {disputing ? (
                <span>Disputing...</span>
              ) : (
                <>
                  <X className="h-4 w-4" />
                  <span>Dispute</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreConfirmation;
