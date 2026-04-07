'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { pl } from '@/lib/translations/pl';
import { en } from '@/lib/translations/en';

type Lang = 'pl' | 'en';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations = { pl, en };

function getNestedValue(obj: any, key: string): string {
  return key.split('.').reduce((acc: any, k: string) => acc?.[k], obj) ?? key;
}

const LangContext = createContext<LangContextType>({
  lang: 'pl',
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pl');

  useEffect(() => {
    const saved = localStorage.getItem('wini-lang') as Lang | null;
    if (saved === 'pl' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('wini-lang', newLang);
  }, []);

  const t = useCallback((key: string) => {
    return getNestedValue(translations[lang], key);
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
