import { useState, useEffect } from 'react';
import { profilesAPI, type PlayerStreaks } from '../services/api/profiles';

export const usePlayerStreaks = (userId: string | null) => {
  const [streaks, setStreaks] = useState<PlayerStreaks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setStreaks(null);
      setLoading(false);
      return;
    }

    const fetchStreaks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profilesAPI.getPlayerStreaks(userId);
        setStreaks(data);
      } catch (err) {
        console.error('Error fetching player streaks:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch streaks');
        setStreaks(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, [userId]);

  return { streaks, loading, error };
};
