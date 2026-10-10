import { ArrowRight, Cpu, Eye, FlaskConical, Gamepad2, Github, Map, Radio, Tag } from "lucide-react";

import { Robot } from "../components/guide/Robot";
import { WorldMap } from "../components/map/WorldMap";
import { useI18n } from "../i18n";

const HOW_ICONS = [Gamepad2, Eye, Tag];
const HOOD_ICONS = [Cpu, Radio, FlaskConical];
const REPO_URL = "https://github.com/neerajkattal/glassbox";

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
            {started ? t.home.continue : t.home.start} <ArrowRight className="h-5 w-5" aria-hidden />
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
          {t.home.how.map((step, i) => {
            const Icon = HOW_ICONS[i];
            return (
              <li key={step.title} className="card flex gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"
                  aria-hidden
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-extrabold">
                    {i + 1}. {step.title}
                  </p>
                  <p className="text-sm text-gray-600">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="hood" className="mt-10 rounded-3xl bg-ink p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="hood" className="text-xl font-extrabold">
            {t.home.hood.title}
          </h2>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn bg-white/10 text-white hover:bg-white/20"
          >
            <Github className="h-4 w-4" aria-hidden /> {t.home.hood.code}
          </a>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {t.home.hood.points.map((point, i) => {
            const Icon = HOOD_ICONS[i];
            return (
              <li key={point.title} className="flex gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
                <div>
                  <p className="font-extrabold">{point.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{point.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="map" className="mt-10">
        <h2 id="map" className="flex items-center gap-2 text-xl font-extrabold">
          <Map className="h-5 w-5 text-brand-500" aria-hidden /> {t.home.mapTitle}
        </h2>
        <div className="mt-3">
          <WorldMap digitDone={digitDone} onOpenDigit={onStart} />
        </div>
      </section>
    </main>
  );
}
