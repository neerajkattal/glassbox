import { Robot } from "../components/guide/Robot";
import { WorldMap } from "../components/map/WorldMap";
import { useI18n } from "../i18n";

interface Props {
  started: boolean;
  digitDone: boolean;
  onStart: () => void;
}

export function HomePage({ started, digitDone, onStart }: Props) {
  const { t } = useI18n();
  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <section className="flex flex-col items-center gap-6 py-10 text-center sm:py-14 md:flex-row md:text-left">
        <div className="flex-1">
          <p className="text-sm font-extrabold uppercase tracking-wider text-brand-600">{t.app.tagline}</p>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl">{t.home.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-gray-600">{t.home.subtitle}</p>
          <button type="button" className="btn-primary mt-6 px-6 py-3.5 text-lg" onClick={onStart}>
            {started ? t.home.continue : t.home.start} →
          </button>
        </div>
        <div className="grid h-48 w-48 shrink-0 place-items-center rounded-full bg-brand-50 sm:h-64 sm:w-64">
          <Robot mood="happy" size={150} />
        </div>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="text-xl font-extrabold">
          {t.home.howTitle}
        </h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-3">
          {t.home.how.map((step, i) => (
            <li key={step.title} className="card flex gap-3">
              <span className="text-3xl" aria-hidden>
                {step.emoji}
              </span>
              <div>
                <p className="font-extrabold">
                  {i + 1}. {step.title}
                </p>
                <p className="text-sm text-gray-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="map" className="mt-10">
        <h2 id="map" className="text-xl font-extrabold">
          🗺️ {t.home.mapTitle}
        </h2>
        <div className="mt-3">
          <WorldMap digitDone={digitDone} onOpenDigit={onStart} />
        </div>
      </section>
    </main>
  );
}
