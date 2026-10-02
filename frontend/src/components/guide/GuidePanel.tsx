import { format, useI18n } from "../../i18n";
import { STEPS, stepIndex, type StepId } from "../../missions/digitIsland";
import { Robot, type Mood } from "./Robot";

interface Props {
  step: StepId;
  values: Record<string, string | number>;
  mood: Mood;
  progress: number | null;
}

export function GuidePanel({ step, values, mood, progress }: Props) {
  const { t } = useI18n();
  const copy = t.steps[step];
  const index = stepIndex(step);
  const total = STEPS.length - 1; // "done" is not a step to complete

  return (
    <section className="card animate-pop" aria-live="polite">
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <Robot mood={mood} size={72} />
        </div>
        <div className="relative min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-brand-50 px-4 py-3 text-[15px] leading-snug text-ink">
          {format(copy.say, values)}
        </div>
      </div>

      {step !== "done" && (
        <div className="mt-4 rounded-2xl border border-dashed border-brand-100 px-4 py-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-brand-600">
            <span>🎯 {t.mission.goal}</span>
            <span className="text-gray-400">
              {format(t.mission.stepOf, { n: Math.min(index + 1, total), total })}
            </span>
          </div>
          <p className="mt-1 font-bold">{copy.goal}</p>
          {progress !== null && (
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}
        </div>
      )}

      <ol className="mt-4 flex gap-1.5" aria-hidden>
        {STEPS.slice(0, -1).map((s, i) => (
          <li
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              i < index ? "bg-emerald-400" : i === index ? "bg-brand-500" : "bg-gray-200"
            }`}
          />
        ))}
      </ol>
    </section>
  );
}
