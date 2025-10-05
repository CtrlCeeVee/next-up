import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { RealtimeChannel, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Shared channel management
let activeChannels: Map<string, RealtimeChannel> = new Map();
let channelStatus: RealtimeStatus = 'disconnected';
let statusListeners: Set<(status: RealtimeStatus) => void> = new Set();

const getOrCreateChannel = (channelName: string) => {
  console.log(`🔍 DEBUG: getOrCreateChannel called with: ${channelName}`);
  console.log(`🔍 DEBUG: Active channels:`, Array.from(activeChannels.keys()));
  console.log(`🔍 DEBUG: Supabase client exists:`, !!supabase);
  
  if (activeChannels.has(channelName)) {
    console.log(`♻️  DEBUG: Reusing existing channel: ${channelName}`);
    return activeChannels.get(channelName)!;
  }

  console.log(`🚀 Creating real-time channel: ${channelName}`);
  
  const channel = supabase.channel(channelName);
  console.log(`🔍 DEBUG: Channel created:`, !!channel);
  activeChannels.set(channelName, channel);

  // Subscribe to the channel
  console.log(`🔍 DEBUG: About to subscribe to channel: ${channelName}`);
  channel.subscribe((status) => {
    console.log(`📡 Channel ${channelName} status:`, status);
    console.log(`🔍 DEBUG: Raw status value:`, status, typeof status);
    
    let newStatus: RealtimeStatus = 'connecting';
    
    if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
      newStatus = 'connected';
      console.log(`✅ Channel ${channelName} connected successfully`);
    } else if (status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR) {
      newStatus = 'error';
      console.error(`❌ Channel ${channelName} error`);
    } else if (status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT) {
      newStatus = 'error';
      console.error(`⏱️ Channel ${channelName} timed out`);
    } else if (status === REALTIME_SUBSCRIBE_STATES.CLOSED) {
      newStatus = 'disconnected';
      console.log(`🔌 Channel ${channelName} disconnected`);
    }

    channelStatus = newStatus;
    statusListeners.forEach(listener => listener(newStatus));
  });

  return channel;
};

const useRealtimeStatus = () => {
  const [status, setStatus] = useState<RealtimeStatus>(channelStatus);

  useEffect(() => {
    // Add status listener
    statusListeners.add(setStatus);
    
    // Set initial status
    setStatus(channelStatus);

    return () => {
      statusListeners.delete(setStatus);
    };
  }, []);

  return status;
};

// Hook for league night check-ins real-time updates
export const useLeagueNightCheckins = (leagueNightInstanceId: number, onUpdate: () => void) => {
  console.log(`🔍 DEBUG: useLeagueNightCheckins called with instanceId: ${leagueNightInstanceId}, onUpdate:`, typeof onUpdate);
  const status = useRealtimeStatus();
  console.log(`🔍 DEBUG: Current realtime status:`, status);

  useEffect(() => {
    console.log(`🔍 DEBUG: useLeagueNightCheckins useEffect triggered. instanceId: ${leagueNightInstanceId}`);
    if (!leagueNightInstanceId) {
      console.log(`⚠️  DEBUG: Skipping check-ins setup - no instanceId`);
      return;
    }

    console.log(`🔔 Setting up check-ins subscription for instance ${leagueNightInstanceId}`);

    const channelName = `league-night-${leagueNightInstanceId}`;
    console.log(`🔍 DEBUG: Channel name: ${channelName}`);
    const channel = getOrCreateChannel(channelName);
    console.log(`🔍 DEBUG: Got channel:`, !!channel);
    
    // Add postgres changes listener
    console.log(`🔍 DEBUG: Adding postgres_changes listener for table: league_night_checkins, filter: league_night_instance_id=eq.${leagueNightInstanceId}`);
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'league_night_checkins',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload: any) => {
        console.log('📨 Check-ins update received:', payload);
        console.log(`🔍 DEBUG: Calling onUpdate function`);
        onUpdate();
      }
    );
    console.log(`✅ DEBUG: Postgres changes listener added for check-ins`);

    return () => {
      console.log(`🧹 Cleaning up check-ins subscription for instance ${leagueNightInstanceId}`);
    };
  }, [leagueNightInstanceId, onUpdate]);
  
  console.log(`🔍 DEBUG: useLeagueNightCheckins hook completed. Status:`, status);

  return { status };
};

// Hook for partnership requests real-time updates
export const usePartnershipRequests = (leagueNightInstanceId: number, userId: string, onUpdate: () => void) => {
  const status = useRealtimeStatus();

  useEffect(() => {
    if (!userId || !leagueNightInstanceId) return;

    console.log(`🔔 Setting up partnership requests subscription for instance ${leagueNightInstanceId}, user ${userId}`);

    const channelName = `league-night-${leagueNightInstanceId}`;
    const channel = getOrCreateChannel(channelName);
    
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'partnership_requests',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload: any) => {
        console.log('📨 Partnership requests update received:', payload);
        // Only trigger update if this change involves the current user
        const record = payload.new || payload.old;
        if (record && 
            ((record as any).requester_id === userId || (record as any).requested_id === userId)) {
          onUpdate();
        }
      }
    );

    return () => {
      console.log(`🧹 Cleaning up partnership requests subscription for instance ${leagueNightInstanceId}`);
    };
  }, [leagueNightInstanceId, userId, onUpdate]);

  return { status };
};

// Hook for confirmed partnerships real-time updates
export const useConfirmedPartnerships = (leagueNightInstanceId: number, onUpdate: () => void) => {
  const status = useRealtimeStatus();

  useEffect(() => {
    if (!leagueNightInstanceId) return;

    console.log(`🔔 Setting up confirmed partnerships subscription for instance ${leagueNightInstanceId}`);

    const channelName = `league-night-${leagueNightInstanceId}`;
    const channel = getOrCreateChannel(channelName);
    
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'confirmed_partnerships',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload: any) => {
        console.log('📨 Confirmed partnerships update received:', payload);
        onUpdate();
      }
    );

    return () => {
      console.log(`🧹 Cleaning up confirmed partnerships subscription for instance ${leagueNightInstanceId}`);
    };
  }, [leagueNightInstanceId, onUpdate]);

  return { status };
};

// Hook for matches real-time updates
export const useMatches = (leagueNightInstanceId: number, onUpdate: () => void) => {
  const status = useRealtimeStatus();

  useEffect(() => {
    if (!leagueNightInstanceId) return;

    console.log(`🔔 Setting up matches subscription for instance ${leagueNightInstanceId}`);

    const channelName = `league-night-${leagueNightInstanceId}`;
    const channel = getOrCreateChannel(channelName);
    
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'matches',
        filter: `league_night_instance_id=eq.${leagueNightInstanceId}`
      },
      (payload: any) => {
        console.log('📨 Matches update received:', payload);
        onUpdate();
      }
    );

    return () => {
      console.log(`🧹 Cleaning up matches subscription for instance ${leagueNightInstanceId}`);
    };
  }, [leagueNightInstanceId, onUpdate]);

  return { status };
};

// Hook for league night instance status changes
export const useLeagueNightStatus = (leagueNightInstanceId: number, onUpdate: () => void) => {
  const status = useRealtimeStatus();

  useEffect(() => {
    if (!leagueNightInstanceId) return;

    console.log(`🔔 Setting up league night status subscription for instance ${leagueNightInstanceId}`);

    const channelName = `league-night-${leagueNightInstanceId}`;
    const channel = getOrCreateChannel(channelName);
    
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'league_night_instances',
        filter: `id=eq.${leagueNightInstanceId}`
      },
      (payload: any) => {
        console.log('📨 League night status update received:', payload);
        onUpdate();
      }
    );

    return () => {
      console.log(`🧹 Cleaning up league night status subscription for instance ${leagueNightInstanceId}`);
    };
  }, [leagueNightInstanceId, onUpdate]);

  return { status };
};