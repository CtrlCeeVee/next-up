-- Fix for ambiguous column reference in get_partnerships_with_game_counts function
-- This fixes the "column reference partnership_id is ambiguous" error

-- Drop and recreate the function with properly qualified column names
DROP FUNCTION IF EXISTS get_partnerships_with_game_counts(INTEGER);

CREATE OR REPLACE FUNCTION get_partnerships_with_game_counts(instance_id INTEGER)
RETURNS TABLE (
    partnership_id INTEGER,
    player1_id UUID,
    player2_id UUID,
    player1_name TEXT,
    player2_name TEXT,
    player1_skill TEXT,
    player2_skill TEXT,
    games_played_tonight INTEGER,
    avg_skill_level DECIMAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cp.id as partnership_id,
        cp.player1_id,
        cp.player2_id,
        p1.full_name as player1_name,
        p2.full_name as player2_name,
        p1.skill_level as player1_skill,
        p2.skill_level as player2_skill,
        COALESCE(game_counts.games_count, 0)::INTEGER as games_played_tonight,
        CASE 
            WHEN p1.skill_level = 'Beginner' AND p2.skill_level = 'Beginner' THEN 1.0
            WHEN p1.skill_level = 'Advanced' AND p2.skill_level = 'Advanced' THEN 3.0
            WHEN (p1.skill_level = 'Beginner' AND p2.skill_level = 'Intermediate') OR 
                 (p1.skill_level = 'Intermediate' AND p2.skill_level = 'Beginner') THEN 1.5
            WHEN (p1.skill_level = 'Intermediate' AND p2.skill_level = 'Advanced') OR 
                 (p1.skill_level = 'Advanced' AND p2.skill_level = 'Intermediate') THEN 2.5
            ELSE 2.0 -- Default to Intermediate
        END as avg_skill_level
    FROM confirmed_partnerships cp
    JOIN profiles p1 ON p1.id = cp.player1_id
    JOIN profiles p2 ON p2.id = cp.player2_id
    LEFT JOIN (
        SELECT 
            all_partnerships.partnership_id,
            COUNT(*)::INTEGER as games_count
        FROM (
            SELECT m1.partnership1_id as partnership_id FROM matches m1
            WHERE m1.league_night_instance_id = instance_id
            UNION ALL
            SELECT m2.partnership2_id as partnership_id FROM matches m2
            WHERE m2.league_night_instance_id = instance_id
        ) all_partnerships
        GROUP BY all_partnerships.partnership_id
    ) game_counts ON game_counts.partnership_id = cp.id
    WHERE cp.league_night_instance_id = instance_id 
    AND cp.is_active = true
    ORDER BY games_played_tonight ASC, avg_skill_level ASC;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_partnerships_with_game_counts(INTEGER) TO anon, authenticated;