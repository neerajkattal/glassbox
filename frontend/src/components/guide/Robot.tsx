export type Mood = "happy" | "thinking" | "dizzy" | "excited";

interface Props {
  mood: Mood;
  size?: number;
}

/** Bit, the friendly robot guide. Pure SVG so it scales and themes cleanly. */
export function Robot({ mood, size = 88 }: Props) {
  const eyes =
    mood === "dizzy" ? (
      <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round">
        <path d="M27 36l8 8M35 36l-8 8M53 36l8 8M61 36l-8 8" />
      </g>
    ) : (
      <g fill="#1f2937">
        <circle cx="31" cy={mood === "thinking" ? 38 : 40} r="5" />
        <circle cx="57" cy={mood === "thinking" ? 38 : 40} r="5" />
        <circle cx="33" cy={mood === "thinking" ? 36 : 38} r="1.6" fill="#fff" />
        <circle cx="59" cy={mood === "thinking" ? 36 : 38} r="1.6" fill="#fff" />
      </g>
    );

  const mouth = {
    happy: <path d="M34 55q10 8 20 0" />,
    excited: <path d="M32 53q12 14 24 0z" fill="#1f2937" />,
    thinking: <path d="M38 57h12" />,
    dizzy: <path d="M34 58q5-5 10 0t10 0" />,
  }[mood];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      role="img"
      aria-label="Bit the robot"
      className={mood === "dizzy" ? "animate-wiggle" : undefined}
    >
      <line x1="44" y1="6" x2="44" y2="18" stroke="#6366f1" strokeWidth="3" />
      <circle cx="44" cy="6" r="5" fill={mood === "excited" ? "#f59e0b" : "#fbbf24"} />
      <rect x="10" y="18" width="68" height="56" rx="20" fill="#6366f1" />
      <rect x="16" y="24" width="56" height="44" rx="15" fill="#eef2ff" />
      {eyes}
      <g stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none">
        {mouth}
      </g>
      <circle cx="22" cy="52" r="3.5" fill="#fca5a5" opacity="0.7" />
      <circle cx="66" cy="52" r="3.5" fill="#fca5a5" opacity="0.7" />
      <rect x="3" y="38" width="7" height="16" rx="3.5" fill="#818cf8" />
      <rect x="78" y="38" width="7" height="16" rx="3.5" fill="#818cf8" />
    </svg>
  );
}
