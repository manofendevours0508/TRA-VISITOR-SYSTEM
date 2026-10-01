import { useEffect, useState } from 'react';
import { getServices } from '../api';
import { useLanguage } from '../i18n/LanguageContext';
import LocationSlideshow from './LocationSlideshow';
import SlideProgressBar from './SlideProgressBar';
import logoImg from '../assets/tra-logo-official.png';

const SLIDE_DURATION_MS = 7000;
const RETRY_INTERVAL_MS = 5000;
const FONT = "'Crimson Pro', 'Minion Pro', Georgia, serif";

export default function AttractScreen() {
  const [services, setServices] = useState([]);
  const [index, setIndex] = useState(0);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      getServices(lang)
        .then((data) => { if (!cancelled) setServices(data); })
        .catch(() => {});
    };
    load();
    // Self-heal if the API was briefly unreachable on first load, instead
    // of leaving the kiosk stuck with nothing to show.
    const retry = setInterval(() => {
      setServices((current) => {
        if (current.length === 0) load();
        return current;
      });
    }, RETRY_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(retry); };
  }, [lang]);

  useEffect(() => {
    if (services.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % services.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [services.length]);

  const service = services[index];
  const steps = service
    ? (pick(service, 'procedure') || '').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-white text-tra-black flex flex-col">
      {/* Shared brand banner, full width */}
      <div className="shrink-0 text-center pt-6 pb-4 px-4 border-b-2 border-tra-black/10">
        <h1 className="text-xl md:text-2xl font-bold tracking-wide" style={{ fontFamily: FONT }}>
          TANZANIA REVENUE AUTHORITY
        </h1>
        <img src={logoImg} alt="TRA" className="w-12 h-12 md:w-14 md:h-14 mx-auto mt-2" />
        <div className="mt-2.5 flex items-center justify-center gap-2">
          <span className="h-px w-12 bg-tra-black/60" />
          <span className="w-1.5 h-1.5 rotate-45 bg-tra-yellow" />
          <span className="h-px w-12 bg-tra-black/60" />
        </div>
        <p className="text-slate-500 mt-3 text-sm md:text-base">{t('tapAnywhere')}</p>
      </div>

      {/* Two-page slideshow body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 h-full flex flex-col overflow-hidden border-r-4 border-tra-yellow">
          {services.length > 1 && <SlideProgressBar duration={SLIDE_DURATION_MS} slideKey={service?.id} />}

          {service && (
            <div key={service.id} className="panel-fade flex-1 flex items-center justify-center px-8 md:px-12">
              <div className="w-full max-w-2xl grid grid-cols-3 gap-4 md:gap-8 items-center">
                <div className="col-span-2">
                  <span className="inline-block bg-tra-yellow text-tra-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    {t('quickAnswer')}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: FONT }}>
                    {pick(service, 'name')}
                  </h2>
                  <p className="text-base md:text-lg text-slate-600 mb-5">
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
                          <span className="text-slate-700 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                <div className="flex flex-col items-center justify-self-center bg-white border-2 border-tra-black rounded-2xl p-4">
                  <img
                    src={`/api/qr/service/${service.id}`}
                    alt={`${t('scanForDetails')} ${pick(service, 'name')}`}
                    className="w-24 md:w-28 h-24 md:h-28"
                  />
                  <p className="text-tra-black text-xs font-semibold mt-2">{t('scanForDetails')}</p>
                </div>
              </div>
            </div>
          )}

          {services.length > 1 && (
            <div className="flex justify-center gap-2 pb-6">
              {services.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'w-8 bg-tra-yellow' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-1/2 h-full overflow-hidden">
          <LocationSlideshow />
        </div>
      </div>
    </div>
  );
}
