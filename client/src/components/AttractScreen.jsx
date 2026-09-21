import { useEffect, useState } from 'react';
import { getServices } from '../api';
import { useLanguage } from '../i18n/LanguageContext';
import LocationSlideshow from './LocationSlideshow';

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
    <div className="fixed inset-0 z-50 bg-tra-black text-white flex">
      <div className="w-1/2 h-full flex flex-col overflow-hidden">
        <div className="text-center pt-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            TANZANIA <span className="text-tra-yellow">REVENUE AUTHORITY</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">{t('tapAnywhere')}</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 md:px-12">
          <div className="w-full max-w-2xl grid grid-cols-3 gap-4 md:gap-8 items-center">
            <div className="col-span-2">
              <div className="text-tra-yellow text-sm font-semibold uppercase tracking-wide mb-2">
                {t('quickAnswer')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{pick(service, 'name')}</h2>
              <p className="text-base md:text-lg text-slate-300 mb-5">
                {pick(service.office, 'name')} · {t('officeNo')} {service.office?.officeNumber} · {pick(service.office, 'floor')}
                {service.office?.wing ? ` · ${pick(service.office, 'wing')}` : ''}
              </p>

              {steps.length > 0 && (
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-base md:text-lg">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-tra-yellow text-tra-black font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-slate-200 pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="flex flex-col items-center justify-self-center bg-white rounded-2xl p-4">
              <img
                src={`/api/qr/service/${service.id}`}
                alt={`${t('scanForDetails')} ${pick(service, 'name')}`}
                className="w-24 md:w-28 h-24 md:h-28"
              />
              <p className="text-tra-black text-xs font-semibold mt-2">{t('scanForDetails')}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 pb-6">
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

      <div className="w-1/2 h-full overflow-hidden border-l-2 border-tra-yellow/40">
        <LocationSlideshow />
      </div>
    </div>
  );
}