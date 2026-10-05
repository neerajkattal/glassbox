interface Option<T extends string> {
  value: T;
  label: string;
  /** Shown instead of `label` on narrow screens. */
  short?: string;
  title?: string;
}

interface Props<T extends string> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

/** A pill-shaped radio group used for the depth and language switches. */
export function Segmented<T extends string>({ label, value, options, onChange }: Props<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-2xl bg-brand-50 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={opt.title ?? opt.label}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-2.5 py-1.5 text-xs font-extrabold transition sm:px-3 sm:text-sm ${
              active ? "bg-white text-brand-700 shadow-sm" : "text-brand-600/70 hover:text-brand-700"
            }`}
          >
            {opt.short ? (
              <>
                <span className="sm:hidden">{opt.short}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </>
            ) : (
              opt.label
            )}
          </button>
        );
      })}
    </div>
  );
}
