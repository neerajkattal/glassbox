import { Annoyed, CircleHelp, Laugh, Meh, Ruler, Smile, type LucideIcon } from "lucide-react";
import { useI18n } from "../../i18n";
import type { Snapshot } from "../../lib/types";

interface Props {
  snapshot: Snapshot | null;
  showNumbers: boolean;
}

type Level = "clueless" | "learning" | "good" | "great" | "exploded";

export function levelFor(snapshot: Snapshot | null): Level {
  if (!snapshot) return "clueless";
  if (snapshot.exploded) return "exploded";
  if (snapshot.accuracy >= 0.9) return "great";
  if (snapshot.accuracy >= 0.75) return "good";
  if (snapshot.accuracy >= 0.3) return "learning";
  return "clueless";
}

const FACE: Record<Level, { Icon: LucideIcon; color: string }> = {
  clueless: { Icon: CircleHelp, color: "text-gray-400" },
  learning: { Icon: Meh, color: "text-amber-500" },
  good: { Icon: Smile, color: "text-emerald-500" },
  great: { Icon: Laugh, color: "text-emerald-600" },
  exploded: { Icon: Annoyed, color: "text-rose-500" },
};

/**
 * The beginner-friendly face of the loss: "how wrong" is simply 1 − accuracy,
 * shown as a red-to-green meter. Tinker mode reveals the actual loss value.
 */
export function WrongMeter({ snapshot, showNumbers }: Props) {
  const { t } = useI18n();
  const level = levelFor(snapshot);
  const wrong = snapshot ? (snapshot.exploded ? 1 : 1 - snapshot.accuracy) : 1;
  const color = wrong > 0.6 ? "bg-rose-400" : wrong > 0.25 ? "bg-amber-400" : "bg-emerald-400";

  return (
    <section className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-extrabold"><Ruler className="h-5 w-5 shrink-0 text-brand-500" aria-hidden /> {t.meter.title}</h2>
        {(() => {
          const { Icon, color } = FACE[level];
          return <Icon className={`h-7 w-7 ${color}`} aria-hidden />;
        })()}
      </div>
      <div
        className="h-5 overflow-hidden rounded-full bg-gray-100"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(wrong * 100)}
        aria-label={t.meter.title}
      >
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${wrong * 100}%` }} />
      </div>
      <p className={`font-bold ${level === "exploded" ? "text-rose-600" : "text-gray-700"}`}>
        {t.meter.levels[level]}
      </p>
      {showNumbers && snapshot && (
        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            [t.meter.accuracy, `${(snapshot.accuracy * 100).toFixed(1)}%`],
            [t.meter.loss, snapshot.loss === null ? "—" : snapshot.loss.toFixed(3)],
            [t.meter.examples, snapshot.samples_seen.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-gray-50 px-2 py-2">
              <dt className="text-[11px] font-semibold leading-tight text-gray-500">{label}</dt>
              <dd className="text-base font-extrabold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
