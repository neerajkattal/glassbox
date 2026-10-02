import { useEffect, useRef } from "react";

import { MNIST_SIZE } from "../../lib/preprocess";

interface Props {
  pixels: Float32Array | null;
  size?: number;
  label?: string;
}

/** Renders a 28x28 image with crisp, visible pixels. */
export function PixelPreview({ pixels, size = 84, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    const image = ctx.createImageData(MNIST_SIZE, MNIST_SIZE);
    for (let i = 0; i < MNIST_SIZE * MNIST_SIZE; i++) {
      const shade = 255 - Math.round((pixels?.[i] ?? 0) * 255);
      image.data.set([shade, shade, shade, 255], i * 4);
    }
    ctx.putImageData(image, 0, 0);
  }, [pixels]);

  return (
    <figure className="flex flex-col items-center gap-1">
      <canvas
        ref={ref}
        width={MNIST_SIZE}
        height={MNIST_SIZE}
        style={{ width: size, height: size, imageRendering: "pixelated" }}
        className="rounded-lg border border-gray-200"
        aria-label={label}
      />
      {label && <figcaption className="text-xs font-semibold text-gray-500">{label}</figcaption>}
    </figure>
  );
}
