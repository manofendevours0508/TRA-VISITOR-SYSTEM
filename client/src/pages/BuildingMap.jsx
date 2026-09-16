import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getOffice } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function BuildingMap() {
  const [searchParams] = useSearchParams();
  const officeId = searchParams.get('office');
  const [office, setOffice] = useState(null);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    if (officeId) getOffice(officeId, lang).then(setOffice);
    else setOffice(null);
  }, [officeId, lang]);

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-2">{t('buildingMapTitle')}</h2>
        {office ? (
          <p className="text-slate-600 mb-6">
            {t('destination')}: <span className="font-semibold text-tra-black">{pick(office, 'name')}</span> — {t('officeNo')} {office.officeNumber}, {pick(office, 'floor')}{pick(office, 'wing') ? `, ${pick(office, 'wing')}` : ''}
          </p>
        ) : (
          <p className="text-slate-600 mb-6">{t('selectOfficeHint')}</p>
        )}

        <div className="bg-white rounded-2xl shadow p-6 border-2 border-dashed border-slate-300 min-h-[400px] flex items-center justify-center text-slate-400">
          {t('floorMapPlaceholder')}
        </div>
      </div>
    </KioskLayout>
  );
}