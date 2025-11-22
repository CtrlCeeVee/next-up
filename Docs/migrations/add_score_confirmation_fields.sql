-- Migration: Add Score Confirmation Fields to Matches Table
-- Date: November 22, 2025
-- Purpose: Enable two-step score confirmation flow (submit → confirm/dispute)

-- Add new columns for pending score submission
ALTER TABLE matches 
  ADD COLUMN pending_team1_score INTEGER CHECK (pending_team1_score >= 0),
  ADD COLUMN pending_team2_score INTEGER CHECK (pending_team2_score >= 0),
  ADD COLUMN pending_submitted_by_partnership_id INTEGER REFERENCES confirmed_partnerships(id),
  ADD COLUMN pending_submitted_at TIMESTAMPTZ,
  ADD COLUMN score_status TEXT DEFAULT 'none' CHECK (score_status IN ('none', 'pending', 'confirmed', 'disputed'));

-- Add constraint: pending scores must be submitted together (all or nothing)
ALTER TABLE matches 
  ADD CONSTRAINT matches_pending_scores_together CHECK (
    (pending_team1_score IS NULL AND pending_team2_score IS NULL AND pending_submitted_by_partnership_id IS NULL) OR 
    (pending_team1_score IS NOT NULL AND pending_team2_score IS NOT NULL AND pending_submitted_by_partnership_id IS NOT NULL)
  );

-- Create index for querying pending scores
CREATE INDEX idx_matches_score_status ON matches(score_status) WHERE score_status != 'none';
CREATE INDEX idx_matches_pending_submitted_by ON matches(pending_submitted_by_partnership_id) WHERE pending_submitted_by_partnership_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN matches.score_status IS 'Tracks score confirmation state: none (no pending), pending (awaiting confirmation), confirmed (finalized), disputed (needs admin resolution)';
