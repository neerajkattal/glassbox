import { format, useI18n } from "../../i18n";
import type { Prediction } from "../../lib/types";
import { AnswerBars } from "./AnswerBars";

interface Props {
  prediction: Prediction | null;
  showNumbers: boolean;
}

export function GuessCard({ prediction, showNumbers }: Props) {
  const { t } = useI18n();
  const confidence = prediction ? prediction.probabilities[prediction.prediction] : 0;

  return (
    <section className="card flex flex-col gap-3">
      <h2 className="text-lg font-extrabold">💭 {t.guess.title}</h2>
      {prediction ? (
        <>
          <div key={`${prediction.prediction}-${confidence}`} className="flex animate-pop items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-4xl font-extrabold text-white">
              {prediction.prediction}
            </span>
            <div>
              <p className="text-lg font-bold">{format(t.guess.says, { digit: prediction.prediction })}</p>
              <p className="text-sm text-gray-500">
                {format(t.guess.confidence, { pct: Math.round(confidence * 100) })}
              </p>
            </div>
          </div>
          <AnswerBars probabilities={prediction.probabilities} showNumbers={showNumbers} />
        </>
      ) : (
        <p className="py-6 text-center text-gray-400">{t.guess.none}</p>
      )}
    </section>
  );
}
