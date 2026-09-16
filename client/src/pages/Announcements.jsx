import { useEffect, useState } from 'react';
import KioskLayout from '../components/KioskLayout';
import { getAnnouncements } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getAnnouncements(lang).then(setAnnouncements);
  }, [lang]);

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-6">{t('announcementsTitle')}</h2>
        {announcements.length === 0 && (
          <p className="text-slate-500">{t('noActiveAnnouncements')}</p>
        )}
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold text-tra-black">{pick(a, 'title')}</h3>
              <p className="text-slate-600 mt-1">{pick(a, 'message')}</p>
            </div>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
}