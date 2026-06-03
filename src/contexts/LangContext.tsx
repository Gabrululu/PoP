'use client';
import { createContext, useContext, useState } from 'react';
import { Lang, T, translations } from '@/i18n/translations';

interface LangCtx {
  lang: Lang;
  toggleLang: () => void;
  T: T;
}

const LangContext = createContext<LangCtx>({
  lang: 'es',
  toggleLang: () => {},
  T: translations.es,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');
  const toggleLang = () => setLang(l => (l === 'es' ? 'en' : 'es'));
  return (
    <LangContext.Provider value={{ lang, toggleLang, T: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
