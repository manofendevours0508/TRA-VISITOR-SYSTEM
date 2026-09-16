import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getOffice } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function OfficeDetail() {
  const { id } = useParams();
  const [office, setOffice] = useState(null);
  const navigate = useNavigate();
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getOffice(id, lang).then(setOffice);
  }, [id, lang]);

  if (!office) {
    return (
      <KioskLayout>
        <p className="text-center text-slate-500">{t('loadingOffice')}</p>
      </KioskLayout>
    );
  }

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <p className="text-sm uppercase tracking-wide text-slate-500">{pick(office.department, 'name')}</p>
        <h2 className="text-3xl font-bold text-tra-black mb-4">{pick(office, 'name')}</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <InfoBox label={t('officeNo')} value={office.officeNumber} />
          <InfoBox label={t('floor')} value={pick(office, 'floor')} />
          <InfoBox label={t('wing')} value={pick(office, 'wing') || '—'} />
        </div>

        {office.contactInfo && (
          <p className="text-slate-600 mb-6">{t('contact')}: {office.contactInfo}</p>
        )}

        {office.services?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('servicesOfferedHere')}</h3>
            <div className="space-y-2">
              {office.services.map((s) => (
                <Link
                  key={s.id}
                  to={`/service/${s.id}`}
                  className="block bg-slate-50 rounded-lg p-4 hover:bg-slate-100"
                >
                  {pick(s, 'name')}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate(`/map?office=${office.id}`)}
            className="flex-1 bg-tra-yellow text-tra-black py-4 rounded-xl text-lg font-semibold hover:bg-tra-yellow-dark"
          >
            {t('viewOnMap')}
          </button>
          <img
            src={`/api/qr/office/${office.id}`}
            alt={t('scanQrForThisOffice')}
            className="w-24 h-24 rounded-lg border"
          />
        </div>
      </div>
    </KioskLayout>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 text-center">
      <div className="text-xs uppercase text-slate-400">{label}</div>
      <div className="text-xl font-semibold text-tra-black">{value}</div>
    </div>
  );
}