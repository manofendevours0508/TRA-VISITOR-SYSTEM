import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    staffApi.get('/reports/summary').then((r) => setSummary(r.data));
  }, []);

  if (!summary) {
    return (
      <StaffLayout>
        <p className="text-slate-500">{t('loadingDashboard')}</p>
      </StaffLayout>
    );
  }

  const tiles = [
    { label: t('totalDocuments'), value: summary.totalDocuments },
    { label: t('pending'), value: summary.pending },
    { label: t('inProgress'), value: summary.inProgress },
    { label: t('completed'), value: summary.completed },
    { label: t('officesLabel'), value: summary.totalOffices },
    { label: t('servicesLabel'), value: summary.totalServices },
    { label: t('activeUsers'), value: summary.totalUsers },
    { label: t('incomingOutgoing'), value: `${summary.incoming} / ${summary.outgoing}` },
  ];

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">{t('administratorDashboard')}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-tra-yellow rounded-xl shadow p-5">
            <div className="text-2xl font-bold text-tra-black">{tile.value}</div>
            <div className="text-sm text-tra-black">{tile.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-3">{t('recentDocuments')}</h2>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">{t('referenceNo')}</th>
              <th className="px-4 py-2">{t('subject')}</th>
              <th className="px-4 py-2">{t('type')}</th>
              <th className="px-4 py-2">{t('status')}</th>
              <th className="px-4 py-2">{t('department')}</th>
            </tr>
          </thead>
          <tbody>
            {summary.recentDocuments.map((doc) => (
              <tr key={doc.id} className="border-t hover:bg-tra-yellow transition-colors">
                <td className="px-4 py-2">
                  <Link to={`/staff/documents/${doc.id}`} className="text-tra-black hover:underline">
                    {doc.referenceNo}
                  </Link>
                </td>
                <td className="px-4 py-2">{doc.subject}</td>
                <td className="px-4 py-2 capitalize">{doc.documentType}</td>
                <td className="px-4 py-2 capitalize">{doc.status}</td>
                <td className="px-4 py-2">{doc.department?.name || '—'}</td>
              </tr>
            ))}
            {summary.recentDocuments.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">{t('noDocumentsRegistered')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}