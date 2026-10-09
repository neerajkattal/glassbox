import { useI18n } from "../../i18n";
import type { ConceptId } from "../../missions/digitIsland";
import { CONCEPT_MATH } from "./math";

interface Props {
  concepts: ConceptId[];
  onOpen: (concept: ConceptId) => void;
}

/** The words learned so far, as chips that reopen their cards. */
export function ConceptShelf({ concepts, onOpen }: Props) {
  const { t } = useI18n();
  if (concepts.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {concepts.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onOpen(c)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-brand-700 shadow-card transition hover:bg-brand-50"
        >
          {(() => {
            const Icon = CONCEPT_MATH[c].icon;
            return <Icon className="h-3.5 w-3.5" aria-hidden />;
          })()}
          {t.concepts[c].name}
        </button>
      ))}
    </div>
  );
}
