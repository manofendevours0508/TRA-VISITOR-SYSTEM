import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { search } from '../api';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState({ services: [], offices: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    search(q).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [q]);

  const total = results.services.length + results.offices.length;

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-1">Search results for "{q}"</h2>
        {loading && <p className="text-slate-500 mt-4">Searching...</p>}
        {!loading && total === 0 && (
          <p className="text-slate-500 mt-4">No offices or services matched your search. Please try another term or ask at the Registry desk.</p>
        )}

        {!loading && results.services.length > 0 && (
          <section className="mt-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Services</h3>
            <div className="space-y-3">
              {results.services.map((s) => (
                <Link
                  key={s.id}
                  to={`/service/${s.id}`}
                  className="block bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                >
                  <div className="font-semibold text-tra-black text-lg">{s.name}</div>
                  <div className="text-slate-600">
                    {s.office?.name} · Office {s.office?.officeNumber} · {s.office?.floor}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!loading && results.offices.length > 0 && (
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Offices</h3>
            <div className="space-y-3">
              {results.offices.map((o) => (
                <Link
                  key={o.id}
                  to={`/office/${o.id}`}
                  className="block bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                >
                  <div className="font-semibold text-tra-black text-lg">{o.name}</div>
                  <div className="text-slate-600">
                    Office {o.officeNumber} · {o.floor} · {o.department?.name}
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
