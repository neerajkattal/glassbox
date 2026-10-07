import type { Prediction, SessionInfo, Snapshot, Weights } from "./types";

// In development Vite proxies /api to the local backend. In production the
// frontend and API live on different hosts, so VITE_API_URL points at the API.
const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const API_PATH = "/api";
const BASE = `${API_ORIGIN}${API_PATH}`;

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
  const path = `${API_PATH}/sessions/${sessionId}/stream`;
  if (API_ORIGIN) return API_ORIGIN.replace(/^http/, "ws") + path;
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}${path}`;
}
