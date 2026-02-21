export interface ReconnectOptions {
  url: string;
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

export class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private retries = 0;
  private manuallyClosed = false;

  private readonly url: string;
  private readonly maxRetries: number;
  private readonly baseDelayMs: number;
  private readonly maxDelayMs: number;

  public onMessage: (message: string) => void = () => {};

  constructor({
    url,
    maxRetries = 10,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
  }: ReconnectOptions) {
    this.url = url;
    this.maxRetries = maxRetries;
    this.baseDelayMs = baseDelayMs;
    this.maxDelayMs = maxDelayMs;

    this.connect();
  }

  private connect() {
    console.log("connecting to", this.url);
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.retries = 0;
    };

    this.ws.onmessage = (event) => {
      this.onMessage(event.data);
    };

    this.ws.onerror = (error) => {
      console.log("WebSocket error:", error);
      this.ws?.close();
    };

    this.ws.onclose = () => {
      console.log("WebSocket closed");

      if (!this.manuallyClosed) {
        this.reconnect();
      }
    };
  }

  private reconnect() {
    if (this.retries >= this.maxRetries) {
      console.log("Max retries reached.");
      return;
    }

    const delay = Math.min(
      this.baseDelayMs * 2 ** this.retries,
      this.maxDelayMs
    );

    console.log(`Reconnecting in ${delay}ms...`);
    this.retries++;

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  public send(data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.log("Cannot send, socket not open.");
    }
  }

  public close() {
    this.manuallyClosed = true;
    this.ws?.close();
  }
}
