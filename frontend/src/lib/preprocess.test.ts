import { describe, expect, it } from "vitest";

import { boundingBox, centerOfMass, MNIST_SIZE, preprocessDrawing, resizeBox } from "./preprocess";

function canvas(size: number, paint: (x: number, y: number) => boolean): Float32Array {
  const ink = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) ink[y * size + x] = paint(x, y) ? 1 : 0;
  return ink;
}

describe("preprocessDrawing", () => {
  it("returns null for an empty canvas", () => {
    expect(preprocessDrawing(new Float32Array(100 * 100), 100)).toBeNull();
  });

  it("finds the bounding box of the ink", () => {
    const ink = canvas(10, (x, y) => x >= 2 && x <= 4 && y >= 6 && y <= 8);
    expect(boundingBox(ink, 10, 10)).toEqual({ x0: 2, y0: 6, x1: 4, y1: 8 });
  });

  it("averages pixels when shrinking", () => {
    const ink = canvas(4, (x) => x < 2);
    const out = resizeBox(ink, 4, { x0: 0, y0: 0, x1: 3, y1: 3 }, 2, 2);
    expect(Array.from(out)).toEqual([1, 0, 1, 0]);
  });

  it("scales a stroke in a corner to a centred 20px digit", () => {
    // A vertical bar drawn in the top-left corner of a 280px canvas.
    const ink = canvas(280, (x, y) => x >= 10 && x < 40 && y >= 10 && y < 150);
    const out = preprocessDrawing(ink, 280)!;
    expect(out).toHaveLength(MNIST_SIZE * MNIST_SIZE);

    const box = boundingBox(out, MNIST_SIZE, MNIST_SIZE)!;
    expect(box.y1 - box.y0 + 1).toBe(20);
    const [cx, cy] = centerOfMass(out, MNIST_SIZE, MNIST_SIZE);
    expect(Math.abs(cx - 13.5)).toBeLessThanOrEqual(1);
    expect(Math.abs(cy - 13.5)).toBeLessThanOrEqual(1);
    expect(Math.max(...out)).toBeLessThanOrEqual(1);
  });
});
