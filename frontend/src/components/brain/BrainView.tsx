import { Brain, Lock } from "lucide-react";
import { useI18n } from "../../i18n";
import type { Prediction } from "../../lib/types";
import { PixelPreview } from "../draw/PixelPreview";

interface Props {
  prediction: Prediction | null;
  pixels: Float32Array | null;
  locked: boolean;
  showNumbers: boolean;
  onBulbClick: (index: number) => void;
}

const W = 560;
const H = 380;
const COLUMNS = { layer1: 210, layer2: 350, answer: 480 };
const TOP = 34;
const BOTTOM = H - 16;

function ys(count: number): number[] {
  const gap = (BOTTOM - TOP) / count;
  return Array.from({ length: count }, (_, i) => TOP + gap * (i + 0.5));
}

/** Mix grey (off) to amber (on) for a bulb brightness in [0, 1]. */
function bulbColor(a: number): string {
  const off = [229, 231, 235];
  const on = [251, 191, 36];
  const mix = off.map((c, i) => Math.round(c + (on[i] - c) * a));
  return `rgb(${mix.join(",")})`;
}

export function BrainView({ prediction, pixels, locked, showNumbers, onBulbClick }: Props) {
  const { t } = useI18n();
  const layer1 = prediction?.activations[0] ?? Array(16).fill(0);
  const layer2 = prediction?.activations[1] ?? Array(16).fill(0);
  const answer = prediction?.probabilities ?? Array(10).fill(0);
  const y16 = ys(16);
  const y10 = ys(10);

  if (locked) {
    return (
      <section className="card flex min-h-48 flex-col items-center justify-center gap-2 text-center">
        <Lock className="h-9 w-9 text-brand-400" aria-hidden />
        <h2 className="text-lg font-extrabold">{t.brain.title}</h2>
        <p className="max-w-sm text-gray-500">{t.brain.locked}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-extrabold"><Brain className="h-5 w-5 shrink-0 text-brand-500" aria-hidden /> {t.brain.title}</h2>
        <p className="text-xs text-gray-500">{t.brain.tapHint}</p>
      </div>

      <div className="mt-2 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[480px] w-full" role="img" aria-label={t.brain.title}>
          <defs>
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* Connections: brighter when the bulb they come from is lit. */}
          <g strokeWidth="1">
            {y16.map((ya, i) =>
              y16.map((yb, j) => (
                <line
                  key={`a${i}-${j}`}
                  x1={COLUMNS.layer1}
                  y1={ya}
                  x2={COLUMNS.layer2}
                  y2={yb}
                  stroke="#3e5080"
                  strokeOpacity={0.03 + 0.12 * layer1[i] * layer2[j]}
                />
              )),
            )}
            {y16.map((ya, i) =>
              y10.map((yb, j) => (
                <line
                  key={`b${i}-${j}`}
                  x1={COLUMNS.layer2}
                  y1={ya}
                  x2={COLUMNS.answer}
                  y2={yb}
                  stroke="#3e5080"
                  strokeOpacity={0.03 + 0.2 * layer2[i] * answer[j]}
                />
              )),
            )}
            {y16.map((y, i) => (
              <line
                key={`e${i}`}
                x1={118}
                y1={H / 2}
                x2={COLUMNS.layer1}
                y2={y}
                stroke="#3e5080"
                strokeOpacity={0.06 + 0.15 * layer1[i]}
              />
            ))}
          </g>

          {/* Column titles */}
          <g fontSize="13" fontWeight="800" fill="#6b7280" textAnchor="middle">
            <text x={70} y={18}>
              {t.brain.eyes}
            </text>
            <text x={COLUMNS.layer1} y={18}>
              {t.brain.layer1}
            </text>
            <text x={COLUMNS.layer2} y={18}>
              {t.brain.layer2}
            </text>
            <text x={COLUMNS.answer + 20} y={18}>
              {t.brain.answer}
            </text>
          </g>

          {/* Eyes: the 28x28 input */}
          <foreignObject x={22} y={H / 2 - 48} width={96} height={96}>
            <PixelPreview pixels={pixels} size={92} />
          </foreignObject>

          {/* Layer 1: clickable bulbs */}
          {y16.map((y, i) => (
            <g
              key={`l1-${i}`}
              role="button"
              tabIndex={0}
              aria-label={`${t.brain.layer1} #${i + 1}`}
              className="cursor-pointer focus:outline-none"
              onClick={() => onBulbClick(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onBulbClick(i)}
            >
              {layer1[i] > 0.6 && (
                <circle cx={COLUMNS.layer1} cy={y} r={11} fill="#fde68a" filter="url(#glow)" />
              )}
              <circle
                cx={COLUMNS.layer1}
                cy={y}
                r={9}
                fill={bulbColor(layer1[i])}
                stroke="#3e5080"
                strokeWidth="1.5"
                className="transition-[fill] duration-300 hover:stroke-[3px]"
              />
              <title>{`#${i + 1}: ${layer1[i].toFixed(2)}`}</title>
              {showNumbers && (
                <text x={COLUMNS.layer1 - 16} y={y + 4} fontSize="9" textAnchor="end" fill="#6b7280">
                  {layer1[i].toFixed(2)}
                </text>
              )}
            </g>
          ))}

          {/* Layer 2 */}
          {y16.map((y, i) => (
            <g key={`l2-${i}`}>
              {layer2[i] > 0.6 && (
                <circle cx={COLUMNS.layer2} cy={y} r={11} fill="#fde68a" filter="url(#glow)" />
              )}
              <circle
                cx={COLUMNS.layer2}
                cy={y}
                r={9}
                fill={bulbColor(layer2[i])}
                stroke="#6e7fa6"
                strokeWidth="1.5"
                className="transition-[fill] duration-300"
              />
              <title>{layer2[i].toFixed(2)}</title>
              {showNumbers && (
                <text x={COLUMNS.layer2 + 14} y={y + 4} fontSize="9" fill="#6b7280">
                  {layer2[i].toFixed(2)}
                </text>
              )}
            </g>
          ))}

          {/* Answer column */}
          {y10.map((y, d) => {
            const best = prediction?.prediction === d;
            return (
              <g key={`out-${d}`}>
                <circle
                  cx={COLUMNS.answer}
                  cy={y}
                  r={12}
                  fill={best ? "#22315a" : bulbColor(answer[d])}
                  stroke="#22315a"
                  strokeWidth="1.5"
                  className="transition-[fill] duration-300"
                />
                <text
                  x={COLUMNS.answer}
                  y={y + 4.5}
                  fontSize="12"
                  fontWeight="800"
                  textAnchor="middle"
                  fill={best ? "#fff" : "#374151"}
                >
                  {d}
                </text>
                {showNumbers && (
                  <text x={COLUMNS.answer + 20} y={y + 4} fontSize="10" fill="#6b7280">
                    {(answer[d] * 100).toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
