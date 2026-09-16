import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const TILES = [
    { label: t('officeDirectory'), to: '/directory' },
    { label: t('registryServices'), to: '/directory' },
    { label: t('buildingMap'), to: '/map' },
    { label: t('announcements'), to: '/announcements' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-tra-black mb-2">{t('welcomeToTra')}</h1>
        <p className="text-lg text-slate-600 mb-8">{t('findYourOffice')}</p>

        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden border-2 border-tra-black">
            <span className="pl-6 text-2xl">🔍</span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-4 py-5 text-xl outline-none"
            />
            <button
              type="submit"
              className="bg-tra-yellow text-tra-black px-8 py-5 text-xl font-bold hover:bg-tra-yellow-dark"
            >
              {t('search')}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TILES.map((tile) => (
            <Link
              key={tile.label}
              to={tile.to}
              className="bg-tra-yellow rounded-2xl shadow p-8 flex items-center justify-center hover:bg-tra-yellow-dark hover:shadow-xl hover:-translate-y-1 transition"
            >
              <span className="text-lg font-semibold text-tra-black">{tile.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
}