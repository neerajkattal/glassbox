import { useCallback, useRef, useState } from "react";

import { readStored, writeStored } from "../lib/storage";
import { advance, type ConceptId, type MissionEvent, type StepId } from "../missions/digitIsland";

export const CONCEPTS_KEY = "digit:concepts";
export const DONE_KEY = "digit:done";

export function storedConcepts(): ConceptId[] {
  try {
    return JSON.parse(readStored(CONCEPTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/**
 * Mission progress for Digit Island.
 *
 * Every visit gets a brand-new (untrained) robot, so the steps always start
 * from the top; what persists is the vocabulary learned and the island badge.
 */
export function useMission() {
  const [step, setStep] = useState<StepId>("meet");
  const [concepts, setConcepts] = useState<ConceptId[]>(storedConcepts);
  const [openConcept, setOpenConcept] = useState<ConceptId | null>(null);
  const stepRef = useRef(step);

  const dispatch = useCallback((event: MissionEvent) => {
    const next = advance(stepRef.current, event);
    if (next.step === stepRef.current) return;
    stepRef.current = next.step;
    setStep(next.step);
    if (next.step === "done") writeStored(DONE_KEY, "1");
    if (next.concept) {
      const concept = next.concept;
      setConcepts((prev) => {
        const updated = prev.includes(concept) ? prev : [...prev, concept];
        writeStored(CONCEPTS_KEY, JSON.stringify(updated));
        return updated;
      });
      setOpenConcept(concept);
    }
  }, []);

  const restart = useCallback(() => {
    stepRef.current = "meet";
    setStep("meet");
  }, []);

  return { step, concepts, openConcept, setOpenConcept, dispatch, restart };
}
