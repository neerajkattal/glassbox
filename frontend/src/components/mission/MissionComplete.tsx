import { BadgeCheck, Map, RotateCcw, Trophy } from "lucide-react";
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
          <h2 className="flex items-center justify-center gap-2 text-2xl font-extrabold sm:justify-start"><Trophy className="h-6 w-6 text-amber-300" aria-hidden /> {t.done.title}</h2>
          <p className="mt-1 text-brand-100">{t.done.body}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-bold">
            <BadgeCheck className="h-4 w-4 text-amber-300" aria-hidden /> {t.done.badge}
          </p>
          <p className="mt-2 text-sm text-brand-100">{t.done.next}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-end">
        <button type="button" className="btn bg-white/15 text-white hover:bg-white/25" onClick={onReplay}>
          <RotateCcw className="h-4 w-4" aria-hidden /> {t.done.replay}
        </button>
        <button type="button" className="btn bg-white text-brand-700 hover:bg-brand-50" onClick={onMap}>
          <Map className="h-4 w-4" aria-hidden /> {t.done.map}
        </button>
      </div>
    </section>
  );
}
