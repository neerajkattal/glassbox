import { useI18n } from "../../i18n";

const ISLANDS = [
  { id: "digit", emoji: "🔢", color: "from-amber-100 to-amber-50" },
  { id: "downhill", emoji: "⛰️", color: "from-emerald-100 to-emerald-50" },
  { id: "blame", emoji: "🌉", color: "from-sky-100 to-sky-50" },
  { id: "words", emoji: "🏙️", color: "from-violet-100 to-violet-50" },
  { id: "highlighter", emoji: "🖍️", color: "from-pink-100 to-pink-50" },
  { id: "memory", emoji: "🏛️", color: "from-orange-100 to-orange-50" },
  { id: "surprise", emoji: "😲", color: "from-teal-100 to-teal-50" },
  { id: "noise", emoji: "🌫️", color: "from-slate-100 to-slate-50" },
] as const;

interface Props {
  digitDone: boolean;
  onOpenDigit: () => void;
}

/** The learning journey: one island per idea, unlocked in order. */
export function WorldMap({ digitDone, onOpenDigit }: Props) {
  const { t } = useI18n();
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ISLANDS.map((island, i) => {
        const copy = t.home.islands[island.id];
        const available = island.id === "digit";
        const badge = available
          ? digitDone
            ? `✅ ${t.home.completed}`
            : `▶ ${t.home.inProgress}`
          : `🔒 ${t.home.comingSoon}`;
        const body = (
          <>
            <div className="flex items-center justify-between">
              <span className="text-3xl" aria-hidden>
                {island.emoji}
              </span>
              <span className="text-xs font-extrabold text-gray-400">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-2 text-lg font-extrabold">{copy.name}</h3>
            <p className="mt-1 text-sm leading-snug text-gray-600">{copy.blurb}</p>
            <span
              className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                available ? "bg-brand-600 text-white" : "bg-white/70 text-gray-500"
              }`}
            >
              {badge}
            </span>
          </>
        );
        const classes = `block h-full rounded-3xl bg-gradient-to-br ${island.color} p-4 text-left`;
        return (
          <li key={island.id}>
            {available ? (
              <button
                type="button"
                onClick={onOpenDigit}
                className={`${classes} w-full shadow-card ring-2 ring-brand-500 transition hover:-translate-y-0.5`}
              >
                {body}
              </button>
            ) : (
              <div className={`${classes} opacity-70`} aria-disabled>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
