import { describe, expect, it } from "vitest";

import type { Snapshot } from "../lib/types";
import { advance, goalProgress, isBrainUnlocked, type MissionEvent, type StepId } from "./digitIsland";

const snap = (overrides: Partial<Snapshot> = {}): MissionEvent => ({
  type: "snapshot",
  snapshot: {
    step: 10,
    samples_seen: 320,
    epoch: 0,
    loss: 1,
    accuracy: 0.5,
    learning_rate: 1,
    batch_size: 32,
    exploded: false,
    ...overrides,
  },
});

describe("Digit Island mission", () => {
  it("walks the happy path from meeting Bit to the final badge", () => {
    const events: MissionEvent[] = [
      { type: "guessed" },
      snap({ accuracy: 0.85 }),
      { type: "guessed" },
      { type: "neuronOpened" },
      snap({ exploded: true }),
      { type: "reset" },
      snap({ accuracy: 0.91 }),
    ];
    let step: StepId = "meet";
    const concepts: string[] = [];
    for (const event of events) {
      const next = advance(step, event);
      step = next.step;
      if (next.concept) concepts.push(next.concept);
    }
    expect(step).toBe("done");
    expect(concepts).toEqual(["training", "neuron", "weights", "learningRate", "gradientDescent"]);
  });

  it("ignores events that do not belong to the current step", () => {
    expect(advance("meet", snap({ accuracy: 0.99 })).step).toBe("meet");
    expect(advance("train", snap({ accuracy: 0.79 })).step).toBe("train");
    expect(advance("break", { type: "guessed" }).step).toBe("break");
  });

  it("does not finish while training has exploded", () => {
    expect(advance("final", snap({ accuracy: 0.95, exploded: true })).step).toBe("final");
  });

  it("unlocks the brain from the peek step onwards", () => {
    expect(isBrainUnlocked("retry")).toBe(false);
    expect(isBrainUnlocked("peek")).toBe(true);
    expect(isBrainUnlocked("done")).toBe(true);
  });

  it("reports goal progress for numeric targets only", () => {
    const s = (snap({ accuracy: 0.4 }) as { snapshot: Snapshot }).snapshot;
    expect(goalProgress("train", s)).toBeCloseTo(0.5);
    expect(goalProgress("meet", s)).toBeNull();
  });
});
