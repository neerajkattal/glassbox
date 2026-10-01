/** Mirrors backend/glassbox/api/schemas.py. */

export interface Snapshot {
  step: number;
  samples_seen: number;
  epoch: number;
  loss: number | null;
  accuracy: number;
  learning_rate: number;
  batch_size: number;
  exploded: boolean;
}

export interface SessionInfo {
  id: string;
  seed: number;
  snapshot: Snapshot;
}

export interface Prediction {
  prediction: number;
  probabilities: number[];
  /** One array per hidden layer; every value is a bulb brightness in [0, 1]. */
  activations: number[][];
}

export interface Weights {
  layer: number;
  /** One 784-long array per first-layer neuron. */
  neurons: number[][];
}

export type StreamCommand =
  | { action: "play"; steps_per_tick?: number }
  | { action: "pause" }
  | { action: "step" }
  | { action: "reset"; learning_rate?: number }
  | { action: "set"; learning_rate?: number; batch_size?: number; steps_per_tick?: number };

export type StreamMessage =
  | { type: "snapshot"; running: boolean; snapshot: Snapshot }
  | { type: "error"; message: string };
