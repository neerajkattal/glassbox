import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { readStored, writeStored } from "../lib/storage";

/** How much detail the learner wants: the same screen, three levels deep. */
export const DEPTHS = ["story", "tinker", "math"] as const;
export type Depth = (typeof DEPTHS)[number];

interface DepthState {
  depth: Depth;
  setDepth: (depth: Depth) => void;
  /** True when the current depth is `level` or deeper. */
  atLeast: (level: Depth) => boolean;
}

const DepthContext = createContext<DepthState | null>(null);

export function DepthProvider({ children }: { children: ReactNode }) {
  const [depth, setDepthState] = useState<Depth>(() => {
    const stored = readStored("depth");
    return DEPTHS.includes(stored as Depth) ? (stored as Depth) : "story";
  });

  const setDepth = useCallback((next: Depth) => {
    setDepthState(next);
    writeStored("depth", next);
  }, []);

  const value = useMemo(
    () => ({
      depth,
      setDepth,
      atLeast: (level: Depth) => DEPTHS.indexOf(depth) >= DEPTHS.indexOf(level),
    }),
    [depth, setDepth],
  );
  return <DepthContext.Provider value={value}>{children}</DepthContext.Provider>;
}

export function useDepth(): DepthState {
  const ctx = useContext(DepthContext);
  if (!ctx) throw new Error("useDepth must be used inside <DepthProvider>");
  return ctx;
}
