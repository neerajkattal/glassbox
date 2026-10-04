import { useI18n } from "../../i18n";
import { Robot } from "../guide/Robot";

interface Props {
  onReplay: () => void;
  onMap: () => void;
}

export function MissionComplete({ onReplay, onMap }: Props) {
  const { t } = useI18n();
  return (
    <section className="card animate-pop bg-gradient-to-br from-brand-600 to-brand-700 text-white">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <Robot mood="excited" size={96} />
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold">🏆 {t.done.title}</h2>
          <p className="mt-1 text-brand-100">{t.done.body}</p>
          <p className="mt-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
            🏝️ {t.done.badge}
          </p>
          <p className="mt-2 text-sm text-brand-100">{t.done.next}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-end">
        <button type="button" className="btn bg-white/15 text-white hover:bg-white/25" onClick={onReplay}>
          ↺ {t.done.replay}
        </button>
        <button type="button" className="btn bg-white text-brand-700 hover:bg-brand-50" onClick={onMap}>
          🗺️ {t.done.map}
        </button>
      </div>
    </section>
  );
}
