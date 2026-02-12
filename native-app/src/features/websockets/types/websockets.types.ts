import {
  ConfirmedPartnership,
  Match,
  PartnershipRequest,
} from "../../league-nights/types";

export enum ConnectionStatus {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  ERROR = "error",
}

export enum NativeRealtimeEventName {
  MATCH = "match",
  PARTNERSHIP_REQUEST = "partnershipRequest",
  CONFIRMED_PARTNERSHIP = "confirmedPartnership",
}

type NativeRealtimeEventPayloadMap = {
  [NativeRealtimeEventName.MATCH]: Match;
  [NativeRealtimeEventName.PARTNERSHIP_REQUEST]: PartnershipRequest;
  [NativeRealtimeEventName.CONFIRMED_PARTNERSHIP]: ConfirmedPartnership;
};

export type NativeRealtimeEventPayload<T extends NativeRealtimeEventName> =
  NativeRealtimeEventPayloadMap[T];

export interface NativeRealtimeMessage<T extends NativeRealtimeEventName> {
  event: T;
  payload: NativeRealtimeEventPayload<T>;
}

export interface RealtimeSubscriptionConfig<T extends NativeRealtimeEventName> {
  /**
   * Event type to listen for. Use "*" to receive all events.
   */
  event: T | "*";
  callback: (payload: NativeRealtimeEventPayload<T>) => void;
}

export type InternalSubscription<T extends NativeRealtimeEventName> = {
  id: number;
  event: RealtimeSubscriptionConfig<T>["event"];
  callback: (payload: NativeRealtimeEventPayload<T>) => void;
};
