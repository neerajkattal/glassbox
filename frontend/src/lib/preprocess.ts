/**
 * Turn a free-hand drawing into an MNIST-style 28x28 image.
 *
 * MNIST digits were scaled to fit a 20x20 box and then shifted so their
 * centre of mass sits in the middle of a 28x28 frame. Doing the same to the
 * user's drawing makes the robot's guesses far more reliable.
 */

export const MNIST_SIZE = 28;
const DIGIT_BOX = 20;
const INK_THRESHOLD = 0.05;

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Ink intensity in [0, 1] from RGBA pixels (uses the alpha channel). */
export function alphaToInk(rgba: Uint8ClampedArray): Float32Array {
  const ink = new Float32Array(rgba.length / 4);
  for (let i = 0; i < ink.length; i++) ink[i] = rgba[i * 4 + 3] / 255;
  return ink;
}

export function boundingBox(ink: Float32Array, width: number, height: number): Box | null {
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (ink[y * width + x] > INK_THRESHOLD) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

/** Area-average resample of a sub-rectangle into an outW x outH image. */
export function resizeBox(
  ink: Float32Array,
  width: number,
  box: Box,
  outW: number,
  outH: number,
): Float32Array {
  const out = new Float32Array(outW * outH);
  const srcW = box.x1 - box.x0 + 1;
  const srcH = box.y1 - box.y0 + 1;
  const sx = srcW / outW;
  const sy = srcH / outH;
  for (let oy = 0; oy < outH; oy++) {
    const yStart = box.y0 + Math.floor(oy * sy);
    const yEnd = Math.max(yStart + 1, box.y0 + Math.floor((oy + 1) * sy));
    for (let ox = 0; ox < outW; ox++) {
      const xStart = box.x0 + Math.floor(ox * sx);
      const xEnd = Math.max(xStart + 1, box.x0 + Math.floor((ox + 1) * sx));
      let sum = 0;
      let count = 0;
      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          sum += ink[y * width + x];
          count++;
        }
      }
      out[oy * outW + ox] = count ? sum / count : 0;
    }
  }
  return out;
}

export function centerOfMass(img: Float32Array, width: number, height: number): [number, number] {
  let total = 0;
  let cx = 0;
  let cy = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = img[y * width + x];
      total += v;
      cx += v * x;
      cy += v * y;
    }
  }
  return total ? [cx / total, cy / total] : [(width - 1) / 2, (height - 1) / 2];
}

/**
 * Convert a square drawing (ink values, row-major) into 784 pixels in [0, 1],
 * or `null` when nothing has been drawn.
 */
export function preprocessDrawing(ink: Float32Array, size: number): Float32Array | null {
  const box = boundingBox(ink, size, size);
  if (!box) return null;

  const w = box.x1 - box.x0 + 1;
  const h = box.y1 - box.y0 + 1;
  const scale = DIGIT_BOX / Math.max(w, h);
  const outW = Math.max(1, Math.round(w * scale));
  const outH = Math.max(1, Math.round(h * scale));
  const digit = resizeBox(ink, size, box, outW, outH);

  const [cx, cy] = centerOfMass(digit, outW, outH);
  const offsetX = Math.round(MNIST_SIZE / 2 - 0.5 - cx);
  const offsetY = Math.round(MNIST_SIZE / 2 - 0.5 - cy);

  const out = new Float32Array(MNIST_SIZE * MNIST_SIZE);
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      const tx = x + offsetX;
      const ty = y + offsetY;
      if (tx >= 0 && tx < MNIST_SIZE && ty >= 0 && ty < MNIST_SIZE) {
        out[ty * MNIST_SIZE + tx] = Math.min(1, digit[y * outW + x]);
      }
    }
  }
  return out;
}
