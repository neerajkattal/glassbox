import { useI18n } from "../../i18n";
import type { HistoryPoint } from "../../hooks/useTraining";

interface Props {
  history: HistoryPoint[];
}

const W = 560;
const H = 180;
const PAD = { top: 12, right: 12, bottom: 22, left: 36 };

/** Loss and accuracy over training steps, drawn as plain SVG. */
export function LossChart({ history }: Props) {
  const { t } = useI18n();

  if (history.length < 2) {
    return (
      <section className="card">
        <h2 className="text-lg font-extrabold">📈 {t.chart.title}</h2>
        <p className="py-8 text-center text-gray-400">{t.chart.empty}</p>
      </section>
    );
  }

  const maxStep = history.at(-1)!.step;
  const maxLoss = Math.max(2.5, ...history.map((p) => Math.min(p.loss, 10)));
  const x = (step: number) => PAD.left + (step / maxStep) * (W - PAD.left - PAD.right);
  const yLoss = (loss: number) =>
    PAD.top + (1 - Math.min(loss, maxLoss) / maxLoss) * (H - PAD.top - PAD.bottom);
  const yAcc = (acc: number) => PAD.top + (1 - acc) * (H - PAD.top - PAD.bottom);

  const line = (y: (p: HistoryPoint) => number) =>
    history.map((p, i) => `${i ? "L" : "M"}${x(p.step).toFixed(1)},${y(p).toFixed(1)}`).join("");

  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold">📈 {t.chart.title}</h2>
        <div className="flex gap-3 text-xs font-bold">
          <span className="text-rose-500">━ {t.chart.loss}</span>
          <span className="text-emerald-600">━ {t.chart.accuracy}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label={t.chart.title}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yAcc(f)}
              y2={yAcc(f)}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
            <text x={PAD.left - 6} y={yAcc(f) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
              {Math.round(f * 100)}%
            </text>
          </g>
        ))}
        <text x={W - PAD.right} y={H - 4} textAnchor="end" fontSize="10" fill="#9ca3af">
          {maxStep.toLocaleString()} steps
        </text>
        <path d={line((p) => yLoss(p.loss))} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
        <path d={line((p) => yAcc(p.accuracy))} fill="none" stroke="#10b981" strokeWidth="2.5" />
      </svg>
    </section>
  );
}
