import { useEffect, useRef, useState, useCallback } from "react";
import { supabaseClient } from "../core/services";
import { RealtimeChannel } from "@supabase/supabase-js";

interface RealtimeSubscriptionConfig {
  table: string;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  filter?: string;
  callback: (payload: any) => void;
}

interface UseRealtimeReturn {
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  resubscribe: () => void;
}

/**
 * Generic real-time subscription hook
 * 
 * Usage:
 * ```tsx
 * const { isConnected } = useRealtime(
 *   "my-channel",
 *   [
 *     {
 *       table: "leagues",
 *       event: "UPDATE",
 *       callback: (payload) => console.log("League updated", payload),
 *     },
 *   ]
 * );
 * ```
 */
export const useRealtime = (
  channelName: string,
  subscriptions: RealtimeSubscriptionConfig[],
  enabled: boolean = true
): UseRealtimeReturn => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");
  const [isConnected, setIsConnected] = useState(false);

  // Stabilize subscription references
  const stableSubscriptions = useRef(subscriptions);

  useEffect(() => {
    stableSubscriptions.current = subscriptions;
  });

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    setConnectionStatus("disconnected");
    setIsConnected(false);
  }, []);

  const setupChannel = useCallback(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    cleanup();

    setConnectionStatus("connecting");

    const channel = supabaseClient.channel(channelName);

    // Set up all subscriptions
    stableSubscriptions.current.forEach((sub) => {
      channel.on(
        "postgres_changes",
        {
          event: sub.event || "*",
          schema: "public",
          table: sub.table,
          ...(sub.filter && { filter: sub.filter }),
        },
        (payload) => {
          sub.callback(payload);
        }
      );
    });

    // Handle connection status
    channel.on("system", {}, (payload: any) => {
      const status = payload.status;

      if (status === "JOINED") {
        setConnectionStatus("connected");
        setIsConnected(true);
      } else if (status === "CHANNEL_ERROR") {
        setConnectionStatus("error");
        setIsConnected(false);
      } else if (status === "CLOSED") {
        setConnectionStatus("disconnected");
        setIsConnected(false);
      }
    });

    // Subscribe
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setConnectionStatus("connected");
        setIsConnected(true);
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setConnectionStatus("error");
        setIsConnected(false);
      }
    });

    channelRef.current = channel;
  }, [channelName, enabled, cleanup]);

  useEffect(() => {
    setupChannel();
    return cleanup;
  }, [setupChannel, cleanup]);

  return {
    isConnected,
    connectionStatus,
    resubscribe: setupChannel,
  };
};
