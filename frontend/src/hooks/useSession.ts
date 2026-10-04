import { useCallback, useEffect, useState } from "react";

import { api } from "../lib/api";
import type { SessionInfo } from "../lib/types";

/** Creates a fresh training session on mount (and again on `retry`). */
export function useSession() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setSession(null);
    api
      .createSession()
      .then((s) => !cancelled && setSession(s))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { session, failed, retry };
}
