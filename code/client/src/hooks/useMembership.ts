// React hook for managing league membership
import { useState, useEffect } from 'react';
import { membershipService, type LeagueMember } from '../services/api/membership';

export const useMembership = (leagueId: number, userId: string | null) => {
  const [isMember, setIsMember] = useState<boolean>(false);
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<boolean>(false);

  // Check membership status
  useEffect(() => {
    const checkMembership = async () => {
      if (!userId || !leagueId) {
        setLoading(false);
        return;
      }

      try {
        const result = await membershipService.checkMembership(leagueId, userId);
        setIsMember(result.isMember);
        setMembership(result.membership);
      } catch (err) {
        console.error('Error checking membership:', err);
        setError(err instanceof Error ? err.message : 'Failed to check membership');
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [leagueId, userId]);

  // Join league function
  const joinLeague = async () => {
    if (!userId || joining) return;

    setJoining(true);
    setError(null);

    try {
      await membershipService.joinLeague(leagueId, userId);
      setIsMember(true);
    } catch (err) {
      console.error('Error joining league:', err);
      setError(err instanceof Error ? err.message : 'Failed to join league');
    } finally {
      setJoining(false);
    }
  };

  return {
    isMember,
    membership,
    loading,
    error,
    joining,
    joinLeague,
  };
};

export const useLeagueMembers = (leagueId: number) => {
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await membershipService.getLeagueMembers(leagueId);
        setMembers(result);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchMembers();
    }
  }, [leagueId]);

  return {
    members,
    loading,
    error,
  };
};