/**
 * The Digit Island mission as a pure state machine.
 *
 * Each step waits for one kind of event (a guess, a training milestone, a
 * tapped bulb…). When it arrives the mission moves on and may unlock a
 * concept card that names what the learner just experienced.
 */

import type { Snapshot } from "../lib/types";

export const STEPS = ["meet", "train", "retry", "peek", "break", "fix", "final", "done"] as const;
export type StepId = (typeof STEPS)[number];

export type ConceptId = "training" | "neuron" | "weights" | "learningRate" | "gradientDescent";

export type MissionEvent =
  | { type: "guessed" }
  | { type: "snapshot"; snapshot: Snapshot }
  | { type: "neuronOpened" }
  | { type: "reset" };

export interface Transition {
  step: StepId;
  concept?: ConceptId;
}

export const TRAIN_TARGET = 0.8;
export const FINAL_TARGET = 0.9;

export function advance(step: StepId, event: MissionEvent): Transition {
  switch (step) {
    case "meet":
      return event.type === "guessed" ? { step: "train" } : { step };
    case "train":
      return event.type === "snapshot" && event.snapshot.accuracy >= TRAIN_TARGET
        ? { step: "retry", concept: "training" }
        : { step };
    case "retry":
      return event.type === "guessed" ? { step: "peek", concept: "neuron" } : { step };
    case "peek":
      return event.type === "neuronOpened" ? { step: "break", concept: "weights" } : { step };
    case "break":
      return event.type === "snapshot" && event.snapshot.exploded
        ? { step: "fix", concept: "learningRate" }
        : { step };
    case "fix":
      return event.type === "reset" ? { step: "final" } : { step };
    case "final":
      return event.type === "snapshot" &&
        !event.snapshot.exploded &&
        event.snapshot.accuracy >= FINAL_TARGET
        ? { step: "done", concept: "gradientDescent" }
        : { step };
    case "done":
      return { step };
  }
}

export function stepIndex(step: StepId): number {
  return STEPS.indexOf(step);
}

/** Bit's brain stays closed in Story mode until the learner reaches it. */
export function isBrainUnlocked(step: StepId): boolean {
  return stepIndex(step) >= stepIndex("peek");
}

/** The goal progress (0–1) to show for steps that have a numeric target. */
export function goalProgress(step: StepId, snapshot: Snapshot | null): number | null {
  if (!snapshot) return null;
  if (step === "train") return Math.min(1, snapshot.accuracy / TRAIN_TARGET);
  if (step === "final") return snapshot.exploded ? 0 : Math.min(1, snapshot.accuracy / FINAL_TARGET);
  return null;
}
