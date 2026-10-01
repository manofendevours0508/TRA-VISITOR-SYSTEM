import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);
const DEFAULT_LANG = 'sw';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('tra_lang') || DEFAULT_LANG);

  useEffect(() => {
    document.documentElement.lang = lang === 'sw' ? 'sw' : 'en';
  }, [lang]);

  const setLanguage = useCallback((newLang) => {
    localStorage.setItem('tra_lang', newLang);
    setLang(newLang);
  }, []);

  const t = useCallback((key) => {
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
  }, [lang]);

  const pick = useCallback((obj, field) => {
    if (!obj) return obj;
    if (lang === 'sw') {
      const swKey = field + 'Sw';
      return obj[swKey] != null ? obj[swKey] : obj[field];
    }
    return obj[field];
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t, pick }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}