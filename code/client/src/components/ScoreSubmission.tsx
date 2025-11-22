import React, { useState } from 'react';
import { CheckCircle, Trophy, X } from 'lucide-react';

// Helper function to validate pickleball scoring rules
const validatePickleballScore = (score1: number, score2: number): { valid: boolean; message?: string } => {
  const maxScore = Math.max(score1, score2);
  const minScore = Math.min(score1, score2);
  const scoreDiff = maxScore - minScore;

  // Game must have a winner (scores can't be tied)
  if (score1 === score2) {
    return {
      valid: false,
      message: 'Game cannot end in a tie'
    };
  }

  // Winner must reach at least 15 points
  if (maxScore < 15) {
    return {
      valid: false,
      message: 'Winning score must be at least 15 points'
    };
  }

  // Must win by at least 2 points
  if (scoreDiff < 2) {
    return {
      valid: false,
      message: 'Must win by at least 2 points'
    };
  }

  // If losing team has 13+ points, winner needs exactly 2 point lead
  if (minScore >= 13 && scoreDiff !== 2) {
    return {
      valid: false,
      message: 'When opponent has 13+ points, must win by exactly 2'
    };
  }

  return { valid: true };
};

interface Match {
  id: number;
  court_number: number;
  status: 'active' | 'completed' | 'cancelled';
  team1_score?: number;
  team2_score?: number;
  pending_team1_score?: number;
  pending_team2_score?: number;
  pending_submitted_by_partnership_id?: number;
  score_status?: 'none' | 'pending' | 'confirmed' | 'disputed';
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

interface ScoreSubmissionProps {
  match: Match;
  currentUserId: string;
  leagueId: string;
  nightId: string;
  onScoreSubmitted: () => void;
}

const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({
  match,
  currentUserId,
  leagueId,
  nightId,
  onScoreSubmitted
}) => {
  const [team1Score, setTeam1Score] = useState<string>('');
  const [team2Score, setTeam2Score] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Check if current user is part of this match
  const isUserInMatch = 
    match.partnership1.player1.id === currentUserId ||
    match.partnership1.player2.id === currentUserId ||
    match.partnership2.player1.id === currentUserId ||
    match.partnership2.player2.id === currentUserId;

  // Determine which team the current user is on
  const isUserTeam1 = 
    match.partnership1.player1.id === currentUserId ||
    match.partnership1.player2.id === currentUserId;

  const handleSubmitScore = async () => {
    if (!team1Score || !team2Score) {
      setError('Please enter scores for both teams');
      return;
    }

    const score1 = parseInt(team1Score);
    const score2 = parseInt(team2Score);

    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      setError('Please enter valid positive numbers');
      return;
    }

    // Client-side validation for pickleball rules
    const validation = validatePickleballScore(score1, score2);
    if (!validation.valid) {
      setError(validation.message || 'Invalid score');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/submit-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: match.id,
          team1_score: score1,
          team2_score: score2,
          user_id: currentUserId
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit score');
      }

      // Success!
      setShowForm(false);
      onScoreSubmitted();
      
    } catch (err) {
      console.error('Error submitting score:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit score');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setTeam1Score('');
    setTeam2Score('');
    setError(null);
  };

  const handleCancelSubmission = async () => {
    setCancelling(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/leagues/${leagueId}/nights/${nightId}/cancel-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: match.id,
          user_id: currentUserId
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel score');
      }

      onScoreSubmitted(); // Refresh match data
      
    } catch (err) {
      console.error('Error cancelling score:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel score');
    } finally {
      setCancelling(false);
    }
  };

  if (!isUserInMatch) {
    return null; // Don't show score submission if user isn't in this match
  }

  // Check if user submitted the pending score
  const userPartnershipId = isUserTeam1 ? match.partnership1?.id : match.partnership2?.id;
  const didUserSubmitScore = match.score_status === 'pending' && 
    match.pending_submitted_by_partnership_id === userPartnershipId;

  // Show persistent waiting message if user submitted pending score
  if (didUserSubmitScore) {
    return (
      <div className="mt-4 space-y-3">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                Score submitted!
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Waiting for opponent confirmation
              </p>
              <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                <p>Submitted score: <span className="font-bold">{match.pending_team1_score} - {match.pending_team2_score}</span></p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleCancelSubmission}
          disabled={cancelling}
          className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {cancelling ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700 dark:border-slate-200"></div>
              Cancelling...
            </>
          ) : (
            <>
              <X className="h-4 w-4" />
              Cancel Score Submission
            </>
          )}
        </button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              🏓 This is your match!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Submit scores when you finish playing
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Submit Score
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <span>Submit Match Score</span>
        </h4>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Team 1 Score */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {`${match.partnership1.player1.first_name} ${match.partnership1.player1.last_name}`} & {`${match.partnership1.player2.first_name} ${match.partnership1.player2.last_name}`}
              {isUserTeam1 && <span className="text-green-600 dark:text-green-400 ml-2">(Your Team)</span>}
            </p>
          </div>
          <div className="ml-4">
            <input
              type="number"
              min="0"
              value={team1Score}
              onChange={(e) => setTeam1Score(e.target.value)}
              placeholder="Score"
              className="w-20 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-center"
            />
          </div>
        </div>

        {/* VS Divider */}
        <div className="text-center text-gray-400 dark:text-gray-500 font-medium">
          vs
        </div>

        {/* Team 2 Score */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {`${match.partnership2.player1.first_name} ${match.partnership2.player1.last_name}`} & {`${match.partnership2.player2.first_name} ${match.partnership2.player2.last_name}`}
              {!isUserTeam1 && <span className="text-green-600 dark:text-green-400 ml-2">(Your Team)</span>}
            </p>
          </div>
          <div className="ml-4">
            <input
              type="number"
              min="0"
              value={team2Score}
              onChange={(e) => setTeam2Score(e.target.value)}
              placeholder="Score"
              className="w-20 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white text-center"
            />
          </div>
        </div>

        {/* Scoring Rules Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50">
          <h5 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            📏 Pickleball Scoring Rules
          </h5>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• First to 15 points wins</li>
            <li>• Must win by at least 2 points</li>
            <li>• Game cannot end in a tie</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSubmitScore}
            disabled={submitting || !team1Score || !team2Score}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Submit Score</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreSubmission;