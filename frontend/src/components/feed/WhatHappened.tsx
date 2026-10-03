import { useI18n } from "../../i18n";

export interface FeedItem {
  id: number;
  text: string;
  tone?: "info" | "good" | "bad";
}

interface Props {
  items: FeedItem[];
}

const DOT = { info: "bg-brand-400", good: "bg-emerald-400", bad: "bg-rose-400" };

/** Turns every action into one plain sentence, newest first. */
export function WhatHappened({ items }: Props) {
  const { t } = useI18n();
  return (
    <section className="card" aria-live="polite">
      <h2 className="text-lg font-extrabold">📜 {t.feed.title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-gray-400">{t.feed.empty}</p>
      ) : (
        <ol className="mt-3 space-y-2.5">
          {items.map((item, i) => (
            <li
              key={item.id}
              className={`flex gap-2.5 text-sm leading-snug ${i === 0 ? "animate-pop font-semibold" : "text-gray-500"}`}
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[item.tone ?? "info"]}`} />
              {item.text}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
