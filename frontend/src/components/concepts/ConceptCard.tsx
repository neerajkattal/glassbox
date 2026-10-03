import { useI18n } from "../../i18n";
import type { ConceptId } from "../../missions/digitIsland";
import { useDepth } from "../../state/depth";
import { Modal } from "../layout/Modal";
import { CONCEPT_MATH } from "./math";

interface Props {
  concept: ConceptId;
  onClose: () => void;
}

/** "You just discovered…" — names what the learner has already experienced. */
export function ConceptCard({ concept, onClose }: Props) {
  const { t } = useI18n();
  const { atLeast } = useDepth();
  const copy = t.concepts[concept];
  const math = CONCEPT_MATH[concept];

  return (
    <Modal onClose={onClose} label={copy.name}>
      <p className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
        🎉 {t.concepts.discovered}
      </p>
      <h2 className="mt-1 flex items-center gap-2 text-2xl font-extrabold">
        <span aria-hidden>{math.emoji}</span> {copy.name}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{copy.story}</p>

      {atLeast("math") && (
        <div className="mt-4 space-y-3">
          <div>
            <h3 className="text-sm font-extrabold text-gray-500">{t.concepts.mathTitle}</h3>
            <pre className="mt-1 whitespace-pre-wrap rounded-2xl bg-brand-50 p-3 font-mono text-sm text-brand-700">
              {math.formula}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-500">{t.concepts.codeTitle}</h3>
            <pre className="mt-1 overflow-x-auto rounded-2xl bg-ink p-3 font-mono text-xs leading-relaxed text-emerald-200">
              {math.code}
            </pre>
          </div>
        </div>
      )}

      <button type="button" className="btn-primary mt-5 w-full text-base" onClick={onClose}>
        {t.concepts.gotIt}
      </button>
    </Modal>
  );
}
