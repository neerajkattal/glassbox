import { useEffect, useRef } from "react";

import { format, useI18n } from "../../i18n";
import { MNIST_SIZE } from "../../lib/preprocess";
import { Modal } from "../layout/Modal";

interface Props {
  index: number;
  weights: number[] | null;
  onClose: () => void;
}

/** Shows a first-layer neuron's 784 weights as a 28x28 orange/blue heatmap. */
export function NeuronDetail({ index, weights, onClose }: Props) {
  const { t } = useI18n();
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !weights) return;
    const scale = Math.max(...weights.map(Math.abs)) || 1;
    const image = ctx.createImageData(MNIST_SIZE, MNIST_SIZE);
    weights.forEach((w, i) => {
      const v = Math.min(1, Math.abs(w) / scale);
      // Positive → orange (249,115,22); negative → blue (59,130,246); zero → white.
      const target = w >= 0 ? [249, 115, 22] : [59, 130, 246];
      const rgb = target.map((c) => Math.round(255 + (c - 255) * v));
      image.data.set([...rgb, 255], i * 4);
    });
    ctx.putImageData(image, 0, 0);
  }, [weights]);

  return (
    <Modal onClose={onClose} label={format(t.brain.neuronTitle, { n: index + 1 })}>
      <h2 className="text-xl font-extrabold">{format(t.brain.neuronTitle, { n: index + 1 })}</h2>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <canvas
          ref={ref}
          width={MNIST_SIZE}
          height={MNIST_SIZE}
          className="h-48 w-48 shrink-0 rounded-2xl border border-gray-200"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="space-y-3">
          <div className="flex gap-3 text-sm font-bold">
            <span className="flex items-center gap-1">
              <i className="inline-block h-3 w-3 rounded bg-orange-500" /> +
            </span>
            <span className="flex items-center gap-1">
              <i className="inline-block h-3 w-3 rounded bg-blue-500" /> −
            </span>
          </div>
          <p className="text-gray-600">{t.brain.neuronHint}</p>
        </div>
      </div>
      <button type="button" className="btn-primary mt-5 w-full" onClick={onClose}>
        {t.brain.close}
      </button>
    </Modal>
  );
}
