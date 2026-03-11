"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { es } from "@/lib/i18n/es";
import { en } from "@/lib/i18n/en";
import type { Translations } from "@/lib/i18n/es";

export type Lang = "es" | "en";

const translations: Record<Lang, Translations> = { es, en };

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "es",
  setLang: () => {},
  t: es,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vetcalc-lang") as Lang | null;
      if (stored === "es" || stored === "en") {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("vetcalc-lang", newLang);
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
