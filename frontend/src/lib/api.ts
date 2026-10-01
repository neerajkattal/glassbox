import type { Prediction, SessionInfo, Snapshot, Weights } from "./types";

const BASE = "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail ?? res.statusText);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  createSession: (seed?: number) =>
    request<SessionInfo>("/sessions", { method: "POST", body: JSON.stringify({ seed }) }),
  getSnapshot: (id: string) => request<Snapshot>(`/sessions/${id}`),
  predict: (id: string, pixels: number[]) =>
    request<Prediction>(`/sessions/${id}/predict`, {
      method: "POST",
      body: JSON.stringify({ pixels }),
    }),
  weights: (id: string) => request<Weights>(`/sessions/${id}/weights`),
};

export function streamUrl(sessionId: string): string {
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}${BASE}/sessions/${sessionId}/stream`;
}
