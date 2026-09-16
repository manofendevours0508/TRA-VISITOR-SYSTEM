import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getService } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getService(id, lang).then(setService);
  }, [id, lang]);

  if (!service) {
    return (
      <KioskLayout>
        <p className="text-center text-slate-500">{t('loadingService')}</p>
      </KioskLayout>
    );
  }

  const steps = (pick(service, 'procedure') || '').split('\n').filter(Boolean);
  const requirements = (pick(service, 'requirements') || '').split('\n').filter(Boolean);

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <p className="text-sm uppercase tracking-wide text-slate-500">{t('serviceLabel')}</p>
        <h2 className="text-3xl font-bold text-tra-black mb-4">{pick(service, 'name')}</h2>
        {pick(service, 'description') && <p className="text-slate-600 mb-6">{pick(service, 'description')}</p>}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <InfoBox label={t('officeLabel')} value={pick(service.office, 'name')} />
          <InfoBox label={t('officeNo')} value={service.office?.officeNumber} />
          <InfoBox label={t('floor')} value={pick(service.office, 'floor')} />
        </div>

        {requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('requiredDocuments')}</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {steps.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('procedure')}</h3>
            <ol className="list-decimal list-inside text-slate-700 space-y-1">
              {steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <Link
            to={`/office/${service.office?.id}`}
            className="flex-1 text-center bg-slate-100 text-tra-black py-4 rounded-xl text-lg font-semibold hover:bg-slate-200"
          >
            {t('officeDetails')}
          </Link>
          <button
            onClick={() => navigate(`/map?office=${service.office?.id}`)}
            className="flex-1 bg-tra-yellow text-tra-black py-4 rounded-xl text-lg font-semibold hover:bg-tra-yellow-dark"
          >
            {t('viewOnMap')}
          </button>
          <img
            src={`/api/qr/service/${service.id}`}
            alt={t('scanQrForThisService')}
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