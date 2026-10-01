import { useCallback, useEffect, useRef, useState } from "react";

import { TrainingSocket, type SocketStatus } from "../lib/trainingSocket";
import type { Snapshot, StreamCommand } from "../lib/types";

export interface HistoryPoint {
  step: number;
  loss: number;
  accuracy: number;
}

const MAX_HISTORY = 400;

/** Live training state for one session, driven over the stream socket. */
export function useTraining(sessionId: string | null) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<SocketStatus>("connecting");
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const socket = useRef<TrainingSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const ws = new TrainingSocket(sessionId, {
      onStatus: setStatus,
      onMessage: (msg) => {
        if (msg.type !== "snapshot") return;
        const snap = msg.snapshot;
        setSnapshot(snap);
        setRunning(msg.running);
        setHistory((prev) => {
          if (snap.step === 0) return [];
          if (snap.loss === null || prev.at(-1)?.step === snap.step) return prev;
          const next = [...prev, { step: snap.step, loss: snap.loss, accuracy: snap.accuracy }];
          return next.length > MAX_HISTORY ? next.filter((_, i) => i % 2 === 0) : next;
        });
      },
    });
    socket.current = ws;
    return () => ws.close();
  }, [sessionId]);

  const send = useCallback((cmd: StreamCommand) => socket.current?.send(cmd), []);

  return { snapshot, running, status, history, send };
}
