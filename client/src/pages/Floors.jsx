import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getOffices } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

const FLOOR_ORDER = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];

export default function Floors() {
  const [offices, setOffices] = useState([]);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getOffices(lang).then(setOffices);
  }, [lang]);

  const floorNames = [...new Set(offices.map((o) => o.floor).filter((f) => f && f !== 'N/A'))].sort(
    (a, b) => {
      const ai = FLOOR_ORDER.indexOf(a);
      const bi = FLOOR_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }
  );

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-2">{t('buildingFloorsTitle')}</h2>
        <p className="text-slate-500 mb-6">{t('selectFloorHint')}</p>
        <div className="grid md:grid-cols-2 gap-4">
          {floorNames.map((floor) => {
            const roomsOnFloor = offices.filter((o) => o.floor === floor);
            const sample = roomsOnFloor[0];
            return (
              <Link
                key={floor}
                to={`/floors/${encodeURIComponent(floor)}`}
                className="bg-tra-yellow rounded-2xl shadow p-6 hover:bg-tra-yellow-dark hover:shadow-lg transition"
              >
                <div className="text-xl font-bold text-tra-black">{pick(sample, 'floor')}</div>
                <div className="text-tra-black/70 text-sm mt-1">
                  {roomsOnFloor.length} {t('roomsLabel')}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </KioskLayout>
  );
}
