import { useCallback, useRef, useState, type PointerEvent } from "react";

import { useI18n } from "../../i18n";
import { alphaToInk, preprocessDrawing } from "../../lib/preprocess";
import { PixelPreview } from "./PixelPreview";

const CANVAS_SIZE = 280;
const BRUSH = 22;

interface Props {
  onAsk: (pixels: Float32Array) => void;
  busy: boolean;
  highlight: boolean;
  showPreview: boolean;
}

/** Finger- and mouse-friendly drawing surface. */
export function DrawPad({ onAsk, busy, highlight, showPreview }: Props) {
  const { t } = useI18n();
  const canvas = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [pixels, setPixels] = useState<Float32Array | null>(null);
  const [warning, setWarning] = useState(false);

  const point = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const drawTo = (to: { x: number; y: number }) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const from = last.current ?? to;
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = BRUSH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    last.current = to;
  };

  const capture = useCallback((): Float32Array | null => {
    const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const { data } = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    return preprocessDrawing(alphaToInk(data), CANVAS_SIZE);
  }, []);

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = null;
    drawTo(point(e));
    setHasInk(true);
    setWarning(false);
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons === 0 && e.pointerType === "mouse") return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    drawTo(point(e));
  };

  const onUp = () => {
    last.current = null;
    setPixels(capture());
  };

  const clear = () => {
    canvas.current?.getContext("2d")?.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    setHasInk(false);
    setPixels(null);
  };

  const ask = () => {
    const image = capture();
    if (!image) {
      setWarning(true);
      return;
    }
    setPixels(image);
    onAsk(image);
  };

  return (
    <section className="card flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <h2 className="text-lg font-extrabold">✏️ {t.draw.title}</h2>
        <span className="text-xs text-gray-500">{t.draw.hint}</span>
      </header>

      <div className="relative mx-auto w-full max-w-[280px]">
        <canvas
          ref={canvas}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="aspect-square w-full touch-none rounded-2xl border-2 border-dashed border-brand-100 bg-white"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgb(99 102 241 / 0.06) 0 35%, transparent 36%)",
          }}
          aria-label={t.draw.hint}
        />
        {showPreview && (
          <div className="pointer-events-none absolute right-2 top-2 rounded-xl bg-white/90 p-1.5 shadow-card">
            <PixelPreview pixels={pixels} size={56} label={t.draw.sees} />
          </div>
        )}
      </div>

      {warning && <p className="text-sm font-semibold text-rose-600">{t.draw.empty}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          className={`btn-primary flex-1 ${highlight ? "ring-4 ring-amber-300 ring-offset-2" : ""}`}
          onClick={ask}
          disabled={busy}
        >
          🤖 {t.draw.ask}
        </button>
        <button type="button" className="btn-soft" onClick={clear} disabled={!hasInk}>
          {t.draw.clear}
        </button>
      </div>
    </section>
  );
}
