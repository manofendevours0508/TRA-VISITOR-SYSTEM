import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('tra_lang') || 'en');

  const setLanguage = useCallback((newLang) => {
    localStorage.setItem('tra_lang', newLang);
    setLang(newLang);
    document.documentElement.lang = newLang === 'sw' ? 'sw' : 'en';
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