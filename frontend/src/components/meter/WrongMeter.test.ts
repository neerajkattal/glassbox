import { describe, expect, it } from "vitest";

import type { Snapshot } from "../../lib/types";
import { levelFor } from "./WrongMeter";

const snap = (accuracy: number, exploded = false): Snapshot => ({
  step: 1,
  samples_seen: 32,
  epoch: 0,
  loss: 1,
  accuracy,
  learning_rate: 1,
  batch_size: 32,
  exploded,
});

describe("levelFor", () => {
  it("maps accuracy to a friendly level", () => {
    expect(levelFor(null)).toBe("clueless");
    expect(levelFor(snap(0.1))).toBe("clueless");
    expect(levelFor(snap(0.5))).toBe("learning");
    expect(levelFor(snap(0.8))).toBe("good");
    expect(levelFor(snap(0.95))).toBe("great");
  });

  it("reports confusion whenever training has exploded", () => {
    expect(levelFor(snap(0.95, true))).toBe("exploded");
  });
});
