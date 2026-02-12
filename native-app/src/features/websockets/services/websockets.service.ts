import { config } from "../../../config";
import {
  ConnectionStatus,
  InternalSubscription,
  NativeRealtimeEventName,
  NativeRealtimeEventPayload,
  NativeRealtimeMessage,
} from "../types";

export class WebsocketsService {
  private socket: WebSocket | null = null;
  private socketStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private subscriptions: InternalSubscription<NativeRealtimeEventName>[] = [];
  private nextSubscriptionId = 1;
  constructor() {}

  private getWebSocketUrl() {
    const base = (config.api.baseUrl || "").replace(/\/$/, "");

    if (base.startsWith("https://")) {
      return base.replace(/^https/, "wss") + "/ws/native";
    }

    if (base.startsWith("http://")) {
      return base.replace(/^http/, "ws") + "/ws/native";
    }

    // Fallback: assume it's already ws(s) or a bare host
    if (base.startsWith("ws://") || base.startsWith("wss://")) {
      return base + "/ws/native";
    }

    return `ws://${base}/ws/native`;
  }

  public connect() {
    this.createSocket();
  }

  private createSocket() {
    this.socket = new WebSocket(this.getWebSocketUrl());
    this.socketStatus = ConnectionStatus.CONNECTING;

    this.socket.onopen = () => {
      this.socketStatus = ConnectionStatus.CONNECTED;
    };

    this.socket.onerror = () => {
      this.socketStatus = ConnectionStatus.ERROR;
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.socketStatus = ConnectionStatus.DISCONNECTED;
    };

    console.log("socket opened");

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(
          event.data
        ) as NativeRealtimeMessage<NativeRealtimeEventName>;
        if (!parsed) return;
        this.broadcastMessage(parsed);
      } catch {
        // Ignore malformed messages
      }
    };
  }

  private broadcastMessage<T extends NativeRealtimeEventName>(
    message: NativeRealtimeMessage<T>
  ) {
    this.subscriptions.forEach((sub) => {
      console.log("sub", sub.event, message.event);
      if (sub.event === "*" || sub.event === message.event) {
        sub.callback(message.payload);
      }
    });
  }

  public disconnect() {
    this.socket?.close();
    this.socket = null;
    this.socketStatus = ConnectionStatus.DISCONNECTED;
    console.log("socket closed");
  }

  public subscribe<T extends NativeRealtimeEventName>(
    event: T | "*",
    callback: (payload: NativeRealtimeEventPayload<T>) => void
  ) {
    const subscription = {
      id: this.nextSubscriptionId++,
      event,
      callback,
    } as InternalSubscription<NativeRealtimeEventName>;
    this.subscriptions.push(subscription);
    return subscription;
  }

  public unsubscribe(
    subscription: InternalSubscription<NativeRealtimeEventName>
  ) {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub.id !== subscription.id
    );
  }
}
