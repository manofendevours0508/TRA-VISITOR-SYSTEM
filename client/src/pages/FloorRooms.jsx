import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getOffices } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function FloorRooms() {
  const { floor } = useParams();
  const floorName = decodeURIComponent(floor);
  const [offices, setOffices] = useState([]);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getOffices(lang).then(setOffices);
  }, [lang]);

  const rooms = offices
    .filter((o) => o.floor === floorName)
    .sort((a, b) => (Number(a.officeNumber) || 0) - (Number(b.officeNumber) || 0));

  const displayFloor = rooms[0] ? pick(rooms[0], 'floor') : floorName;

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/floors" className="text-sm text-slate-500 hover:text-tra-black mb-4 inline-block">
          ← {t('backToFloors')}
        </Link>
        <h2 className="text-2xl font-bold text-tra-black mb-6">{displayFloor}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {rooms.map((o) => (
            <Link
              key={o.id}
              to={`/office/${o.id}`}
              className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition flex items-center gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-tra-yellow text-tra-black font-bold flex items-center justify-center">
                {o.officeNumber}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-tra-black truncate">{pick(o, 'name')}</div>
                <div className="text-slate-500 text-sm">
                  {o.services?.length || 0} {t('servicesHeader')}
                </div>
              </div>
            </Link>
          ))}
          {rooms.length === 0 && (
            <p className="text-slate-400 col-span-2">{t('noOfficesInDept')}</p>
          )}
        </div>
      </div>
    </KioskLayout>
  );
}
