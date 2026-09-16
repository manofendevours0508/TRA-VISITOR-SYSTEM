import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';
import { useLanguage } from '../../i18n/LanguageContext';

export default function FileTracking() {
  const [documents, setDocuments] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    staffApi.get('/documents', { params: { status: 'in-transit' } }).then((r) => setDocuments(r.data));
  }, []);

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">{t('fileTrackingTitle')}</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">{t('referenceNo')}</th>
              <th className="px-4 py-2">{t('subject')}</th>
              <th className="px-4 py-2">{t('currentlyWith')}</th>
              <th className="px-4 py-2">{t('department')}</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t hover:bg-tra-yellow transition-colors">
                <td className="px-4 py-2">
                  <Link to={`/staff/documents/${doc.id}`} className="text-tra-black hover:underline">
                    {doc.referenceNo}
                  </Link>
                </td>
                <td className="px-4 py-2">{doc.subject}</td>
                <td className="px-4 py-2">{doc.assignedTo?.fullName || '—'}</td>
                <td className="px-4 py-2">{doc.department?.name || '—'}</td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">{t('noFilesInTransit')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}