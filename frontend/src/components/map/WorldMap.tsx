import {
  ArrowLeftRight,
  CircleCheck,
  CloudFog,
  Hash,
  Highlighter,
  Landmark,
  Lock,
  MessageSquareText,
  Mountain,
  Play,
  Sparkles,
} from "lucide-react";

import { useI18n } from "../../i18n";

const ISLANDS = [
  { id: "digit", icon: Hash },
  { id: "downhill", icon: Mountain },
  { id: "blame", icon: ArrowLeftRight },
  { id: "words", icon: MessageSquareText },
  { id: "highlighter", icon: Highlighter },
  { id: "memory", icon: Landmark },
  { id: "surprise", icon: Sparkles },
  { id: "noise", icon: CloudFog },
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
        const BadgeIcon = available ? (digitDone ? CircleCheck : Play) : Lock;
        const badgeText = available ? (digitDone ? t.home.completed : t.home.inProgress) : t.home.comingSoon;
        const Icon = island.icon;
        const body = (
          <>
            <div className="flex items-center justify-between">
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  available ? "bg-amber-100 text-amber-700" : "bg-brand-50 text-brand-400"
                }`}
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-extrabold text-gray-400">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-2 text-lg font-extrabold">{copy.name}</h3>
            <p className="mt-1 text-sm leading-snug text-gray-600">{copy.blurb}</p>
            <span
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                available ? "bg-brand-600 text-white" : "bg-brand-50 text-gray-500"
              }`}
            >
              <BadgeIcon className="h-3 w-3" aria-hidden />
              {badgeText}
            </span>
          </>
        );
        const classes = `block h-full rounded-3xl border p-4 text-left ${
          available ? "border-amber-300 bg-white" : "border-brand-100 bg-white/60"
        }`;
        return (
          <li key={island.id}>
            {available ? (
              <button
                type="button"
                onClick={onOpenDigit}
                className={`${classes} w-full shadow-card ring-2 ring-amber-300 transition hover:-translate-y-0.5`}
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
