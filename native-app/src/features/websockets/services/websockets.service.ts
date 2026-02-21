import { config } from "../../../config";
import {
  InternalSubscription,
  NativeMessage,
  NativeRealtimeEventName,
  NativeRealtimeMessage,
} from "../types";
import { ReconnectingWebSocket } from "../types/websocket";

export class WebsocketsService {
  private socket: ReconnectingWebSocket | null = null;
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
    this.socket = new ReconnectingWebSocket({
      url: this.getWebSocketUrl(),
      baseDelayMs: 1000,
      maxDelayMs: 30000,
      maxRetries: 25,
    });
    this.socket.onMessage = (message) => {
      const parsed = JSON.parse(
        message
      ) as NativeRealtimeMessage<NativeRealtimeEventName>;
      this.broadcastMessage(parsed);
    };
  }

  private broadcastMessage<T extends NativeRealtimeEventName>(
    message: NativeRealtimeMessage<T>
  ) {
    this.subscriptions.forEach((sub) => {
      console.log("sub", sub.event, message.event);
      if (sub.event === "*" || sub.event === message.event) {
        sub.callback(message);
      }
    });
  }

  public disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  public subscribe<T extends NativeRealtimeEventName>(
    event: T | "*",
    callback: (message: NativeMessage<T>) => void
  ) {
    const subscription = {
      id: this.nextSubscriptionId++,
      event,
      callback,
    } as InternalSubscription<NativeRealtimeEventName>;
    this.subscriptions.push(subscription);
    return () => this.unsubscribe(subscription);
  }

  public unsubscribe(
    subscription: InternalSubscription<NativeRealtimeEventName>
  ) {
    this.subscriptions = this.subscriptions.filter(
      (sub) => sub.id !== subscription.id
    );
  }
}
