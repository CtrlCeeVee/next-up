import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface LeagueNightRealtimeCallbacks {
  onCheckinsUpdate?: () => void;
  onPartnershipRequestsUpdate?: () => void;
  onConfirmedPartnershipsUpdate?: () => void;
  onMatchesUpdate?: () => void;
  onLeagueNightStatusUpdate?: () => void;
}

interface UseLeagueNightRealtimeReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

/**
 * Single hook to manage all real-time subscriptions for a league night
 * This replaces the multiple individual hooks to prevent subscription churn
 */
export const useLeagueNightRealtime = (
  leagueNightInstanceId: number,
  userId: string,
  callbacks: LeagueNightRealtimeCallbacks
): UseLeagueNightRealtimeReturn => {

  
  const channelRef = useRef<RealtimeChannel | null>(null);
  const connectionStatusRef = useRef<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const isConnectedRef = useRef(false);

  // Stabilize callback references to prevent infinite re-renders
  const stableCallbacks = useRef(callbacks);
  
  // Update callbacks without triggering re-subscription
  useEffect(() => {
    stableCallbacks.current = callbacks;
  });

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    connectionStatusRef.current = 'disconnected';
    isConnectedRef.current = false;
  }, [leagueNightInstanceId]);

  const setupSubscriptions = useCallback(() => {
    // Don't setup if no valid instance ID
    if (!leagueNightInstanceId || leagueNightInstanceId <= 0) {
      return;
    }

    // Clean up existing channel first
    cleanup();

    connectionStatusRef.current = 'connecting';

    // Create a single channel for this league night
    const channelName = `league-night-${leagueNightInstanceId}`;
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: userId }
      }
    });

    // Set up all subscriptions on the same channel
    
        // 1. Check-ins subscription
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'league_night_checkins',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload) => {
        stableCallbacks.current.onCheckinsUpdate?.();
      }
    );

    // 2. Partnership requests subscription
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'partnership_requests',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload) => {
        stableCallbacks.current.onPartnershipRequestsUpdate?.();
      }
    );

    // 3. Confirmed partnerships subscription
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'confirmed_partnerships',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload) => {
        stableCallbacks.current.onConfirmedPartnershipsUpdate?.();
      }
    );

    // 4. Matches subscription
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload) => {
        stableCallbacks.current.onMatchesUpdate?.();
      }
    );

    // 5. League night status subscription
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'league_night_instances',
        filter: `id=eq.${leagueNightInstanceId}`
      },
      (payload) => {
        stableCallbacks.current.onLeagueNightStatusUpdate?.();
      }
    );

    // Handle connection status
    channel.on('system', {}, (payload: any) => {
      const status = payload.status;
      
      if (status === 'JOINED') {
        connectionStatusRef.current = 'connected';
        isConnectedRef.current = true;
      } else if (status === 'CHANNEL_ERROR') {
        connectionStatusRef.current = 'error';
        isConnectedRef.current = false;
      } else if (status === 'CLOSED') {
        connectionStatusRef.current = 'disconnected';
        isConnectedRef.current = false;
      }
    });

    // Subscribe to the channel
    channel.subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        connectionStatusRef.current = 'connected';
        isConnectedRef.current = true;
      } else if (status === 'CHANNEL_ERROR') {
        connectionStatusRef.current = 'error';
        isConnectedRef.current = false;
      } else if (status === 'TIMED_OUT') {
        connectionStatusRef.current = 'error';
        isConnectedRef.current = false;
      }
    });

    channelRef.current = channel;
  }, [leagueNightInstanceId, userId]); // Removed cleanup dependency

  // Set up subscriptions when instance ID or user ID changes (NOT callbacks)
  useEffect(() => {
    setupSubscriptions();
    return cleanup;
  }, [leagueNightInstanceId, userId]); // Remove setupSubscriptions dependency to prevent loop

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isConnected: isConnectedRef.current,
    connectionStatus: connectionStatusRef.current
  };
};