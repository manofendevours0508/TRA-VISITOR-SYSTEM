import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLanguage, t } = useLanguage();
  return (
    <button
      onClick={() => setLanguage(lang === 'en' ? 'sw' : 'en')}
      className="bg-tra-yellow text-tra-black px-3 py-1 rounded-lg text-sm font-semibold hover:bg-tra-yellow-dark"
    >
      {lang === 'en' ? t('langSw') : t('langEn')}
    </button>
  );
}