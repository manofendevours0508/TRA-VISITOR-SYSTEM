import { useEffect, useState } from 'react';
import { getServices } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

const SLIDE_DURATION_MS = 7000;

export default function AttractScreen() {
  const [services, setServices] = useState([]);
  const [index, setIndex] = useState(0);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getServices(lang).then(setServices);
  }, [lang]);

  useEffect(() => {
    if (services.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % services.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [services.length]);

  if (services.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-tra-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          TANZANIA <span className="text-tra-yellow">REVENUE AUTHORITY</span>
        </h1>
      </div>
    );
  }

  const service = services[index];
  const steps = (pick(service, 'procedure') || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 bg-tra-black text-white flex flex-col">
      <div className="text-center pt-10">
        <h1 className="text-3xl font-bold tracking-wide">
          TANZANIA <span className="text-tra-yellow">REVENUE AUTHORITY</span>
        </h1>
        <p className="text-slate-400 mt-2 text-lg">{t('tapAnywhere')}</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-16">
        <div className="max-w-4xl w-full grid grid-cols-3 gap-10 items-center">
          <div className="col-span-2">
            <div className="text-tra-yellow text-lg font-semibold uppercase tracking-wide mb-2">
              {t('quickAnswer')}
            </div>
            <h2 className="text-5xl font-bold mb-4">{pick(service, 'name')}</h2>
            <p className="text-xl text-slate-300 mb-6">
              {pick(service.office, 'name')} · {t('officeNo')} {service.office?.officeNumber} · {pick(service.office, 'floor')}
              {service.office?.wing ? ` · ${pick(service.office, 'wing')}` : ''}
            </p>

            {steps.length > 0 && (
              <ol className="space-y-3">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-xl">
                    <span className="shrink-0 w-9 h-9 rounded-full bg-tra-yellow text-tra-black font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-slate-200 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex flex-col items-center justify-self-center bg-white rounded-2xl p-6">
            <img
              src={`/api/qr/service/${service.id}`}
              alt={`${t('scanForDetails')} ${pick(service, 'name')}`}
              className="w-40 h-40"
            />
            <p className="text-tra-black text-sm font-semibold mt-3">{t('scanForDetails')}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-10">
        {services.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-tra-yellow' : 'w-2 bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}