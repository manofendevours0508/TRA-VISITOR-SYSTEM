import { Link, useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';

export default function KioskLayout({ children }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-tra-black text-white px-8 py-5 flex items-center justify-between shadow border-b-4 border-tra-yellow">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-wide"
        >
          TANZANIA <span className="text-tra-yellow">REVENUE AUTHORITY</span>
        </button>
        <nav className="flex items-center gap-6 text-lg">
          <Link to="/" className="hover:text-tra-yellow">{t('home')}</Link>
          <Link to="/map" className="hover:text-tra-yellow">{t('buildingMap')}</Link>
          <Link to="/announcements" className="hover:text-tra-yellow">{t('announcements')}</Link>
          <LanguageToggle />
        </nav>
      </header>
      <main className="flex-1 px-8 py-8">{children}</main>
      <footer className="bg-tra-black text-white text-center py-3 text-sm">
        {t('footerText')}
      </footer>
    </div>
  );
}