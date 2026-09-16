import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { search } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState({ services: [], offices: [] });
  const [loading, setLoading] = useState(true);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    setLoading(true);
    search(q, lang).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [q, lang]);

  const total = results.services.length + results.offices.length;

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-1">{t('searchResultsFor')} "{q}"</h2>
        {loading && <p className="text-slate-500 mt-4">{t('searching')}</p>}
        {!loading && total === 0 && (
          <p className="text-slate-500 mt-4">{t('noResults')}</p>
        )}

        {!loading && results.services.length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">{t('services')}</h3>
            <div className="space-y-3">
              {results.services.map((s) => (
                <Link
                  key={s.id}
                  to={`/service/${s.id}`}
                  className="block bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                >
                  <div className="font-semibold text-tra-black text-lg">{pick(s, 'name')}</div>
                  <div className="text-slate-600">
                    {pick(s.office, 'name')} · {t('officeNo')} {s.office?.officeNumber} · {pick(s.office, 'floor')}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!loading && results.offices.length > 0 && (
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">{t('offices')}</h3>
            <div className="space-y-3">
              {results.offices.map((o) => (
                <Link
                  key={o.id}
                  to={`/office/${o.id}`}
                  className="block bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                >
                  <div className="font-semibold text-tra-black text-lg">{pick(o, 'name')}</div>
                  <div className="text-slate-600">
                    {t('officeNo')} {o.officeNumber} · {pick(o, 'floor')} · {pick(o.department, 'name')}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </KioskLayout>
  );
}