import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { en, type Messages } from "./en";
import { hinglish } from "./hinglish";
import { readStored, writeStored } from "../lib/storage";

export const LANGUAGES = {
  en: { label: "English", short: "EN", messages: en as Messages },
  hinglish: { label: "Hinglish", short: "HI", messages: hinglish },
} as const;

export type Language = keyof typeof LANGUAGES;

/** Replace `{name}` placeholders with values. */
export function format(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

interface I18n {
  lang: Language;
  t: Messages;
  setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = readStored("lang");
    return stored === "en" || stored === "hinglish" ? stored : "hinglish";
  });

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    writeStored("lang", next);
    document.documentElement.lang = next === "en" ? "en" : "hi-Latn";
  }, []);

  const value = useMemo(() => ({ lang, t: LANGUAGES[lang].messages, setLang }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
