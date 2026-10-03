interface Props {
  probabilities: number[];
  showNumbers: boolean;
}

/** Ten bars, one per digit: how much Bit believes each answer. */
export function AnswerBars({ probabilities, showNumbers }: Props) {
  const best = probabilities.indexOf(Math.max(...probabilities));
  return (
    <ol className="grid grid-cols-10 items-end gap-1" aria-label="Answer confidence per digit">
      {probabilities.map((p, digit) => (
        <li key={digit} className="flex flex-col items-center gap-1">
          <div className="flex h-20 w-full items-end overflow-hidden rounded-lg bg-gray-100">
            <div
              className={`w-full rounded-lg transition-all duration-500 ${
                digit === best ? "bg-brand-500" : "bg-brand-100"
              }`}
              style={{ height: `${Math.max(4, p * 100)}%` }}
            />
          </div>
          <span className={`text-sm font-extrabold ${digit === best ? "text-brand-600" : "text-gray-400"}`}>
            {digit}
          </span>
          {showNumbers && (
            <span className="text-[10px] tabular-nums text-gray-400">{Math.round(p * 100)}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
