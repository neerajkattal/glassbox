import { streamUrl } from "./api";
import type { StreamCommand, StreamMessage } from "./types";

export type SocketStatus = "connecting" | "open" | "closed";

interface Handlers {
  onMessage: (msg: StreamMessage) => void;
  onStatus: (status: SocketStatus) => void;
}

/** Thin wrapper around the training WebSocket that queues commands until it opens. */
export class TrainingSocket {
  private ws: WebSocket;
  private queue: StreamCommand[] = [];
  private closedByUs = false;

  constructor(sessionId: string, handlers: Handlers) {
    handlers.onStatus("connecting");
    this.ws = new WebSocket(streamUrl(sessionId));
    this.ws.onopen = () => {
      handlers.onStatus("open");
      this.queue.forEach((cmd) => this.ws.send(JSON.stringify(cmd)));
      this.queue = [];
    };
    this.ws.onmessage = (event) => handlers.onMessage(JSON.parse(event.data));
    this.ws.onclose = () => {
      if (!this.closedByUs) handlers.onStatus("closed");
    };
  }

  send(cmd: StreamCommand): void {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(cmd));
    else this.queue.push(cmd);
  }

  close(): void {
    this.closedByUs = true;
    this.ws.close();
  }
}
