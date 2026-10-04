import { useCallback, useRef, useState } from "react";

import { readStored, writeStored } from "../lib/storage";
import {
  advance,
  STEPS,
  type ConceptId,
  type MissionEvent,
  type StepId,
} from "../missions/digitIsland";

const STEP_KEY = "digit:step";
const CONCEPTS_KEY = "digit:concepts";
export const DONE_KEY = "digit:done";

function storedStep(): StepId {
  const value = readStored(STEP_KEY);
  // A finished island restarts from the top; a half-finished one resumes.
  return STEPS.includes(value as StepId) && value !== "done" ? (value as StepId) : "meet";
}

function storedConcepts(): ConceptId[] {
  try {
    return JSON.parse(readStored(CONCEPTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Mission progress for Digit Island, persisted across visits. */
export function useMission() {
  const [step, setStep] = useState<StepId>(storedStep);
  const [concepts, setConcepts] = useState<ConceptId[]>(storedConcepts);
  const [openConcept, setOpenConcept] = useState<ConceptId | null>(null);
  const stepRef = useRef(step);

  const dispatch = useCallback((event: MissionEvent) => {
    const next = advance(stepRef.current, event);
    if (next.step === stepRef.current) return;
    stepRef.current = next.step;
    setStep(next.step);
    writeStored(STEP_KEY, next.step);
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
    writeStored(STEP_KEY, "meet");
  }, []);

  return { step, concepts, openConcept, setOpenConcept, dispatch, restart };
}
