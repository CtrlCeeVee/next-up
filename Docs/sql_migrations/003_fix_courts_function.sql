-- Fix for ambiguous column reference in get_available_courts function
-- This fixes the "column reference court_labels is ambiguous" error

-- Drop and recreate the function with properly qualified column names
DROP FUNCTION IF EXISTS get_available_courts(INTEGER);

CREATE OR REPLACE FUNCTION get_available_courts(instance_id INTEGER)
RETURNS TABLE (
    court_number INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_courts INTEGER;
    court_labels_array TEXT[];
    used_courts INTEGER[];
    court_num INTEGER;
BEGIN
    -- Get total courts and court labels from league night instance
    SELECT lni.courts_available, lni.court_labels 
    INTO total_courts, court_labels_array
    FROM league_night_instances lni
    WHERE lni.id = instance_id;
    
    -- Get currently used courts
    SELECT ARRAY_AGG(m.court_number) 
    INTO used_courts
    FROM matches m 
    WHERE m.league_night_instance_id = instance_id 
    AND m.status = 'active';
    
    -- Return available court numbers based on court_labels array
    -- If court_labels exists, use the array indices
    -- Otherwise fall back to 1..total_courts
    IF court_labels_array IS NOT NULL AND array_length(court_labels_array, 1) > 0 THEN
        FOR i IN 1..array_length(court_labels_array, 1) LOOP
            IF used_courts IS NULL OR NOT (i = ANY(used_courts)) THEN
                court_number := i;
                RETURN NEXT;
            END IF;
        END LOOP;
    ELSE
        -- Fallback to simple numbering if no court labels
        FOR i IN 1..total_courts LOOP
            IF used_courts IS NULL OR NOT (i = ANY(used_courts)) THEN
                court_number := i;
                RETURN NEXT;
            END IF;
        END LOOP;
    END IF;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_available_courts(INTEGER) TO anon, authenticated;