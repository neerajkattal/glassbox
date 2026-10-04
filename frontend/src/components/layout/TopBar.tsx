import { LANGUAGES, useI18n, type Language } from "../../i18n";
import { DEPTHS, useDepth, type Depth } from "../../state/depth";
import { Robot } from "../guide/Robot";
import { Segmented } from "./Segmented";

interface Props {
  title?: string;
  onHome: () => void;
  showDepth: boolean;
}

const DEPTH_ICON: Record<Depth, string> = { story: "👀", tinker: "🔧", math: "🧮" };

export function TopBar({ title, onHome, showDepth }: Props) {
  const { t, lang, setLang } = useI18n();
  const { depth, setDepth } = useDepth();
  const hints = { story: t.depth.storyHint, tinker: t.depth.tinkerHint, math: t.depth.mathHint };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/60 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <button type="button" onClick={onHome} className="flex items-center gap-2" aria-label={t.nav.map}>
          <Robot mood="happy" size={36} />
          <span className="text-lg font-extrabold tracking-tight">{t.app.name}</span>
        </button>
        {title && (
          <span className="hidden rounded-full bg-white px-3 py-1 text-sm font-bold text-brand-700 shadow-card sm:inline">
            🏝️ {title}
          </span>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {showDepth && (
            <Segmented<Depth>
              label={t.nav.depth}
              value={depth}
              onChange={setDepth}
              options={DEPTHS.map((d) => ({
                value: d,
                label: `${DEPTH_ICON[d]} ${t.depth[d]}`,
                title: hints[d],
              }))}
            />
          )}
          <Segmented<Language>
            label={t.nav.language}
            value={lang}
            onChange={setLang}
            options={(Object.keys(LANGUAGES) as Language[]).map((l) => ({
              value: l,
              label: LANGUAGES[l].label,
            }))}
          />
        </div>
      </div>
    </header>
  );
}
