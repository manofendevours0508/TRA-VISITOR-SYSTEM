import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    staffApi.get('/reports/summary').then((r) => setSummary(r.data));
  }, []);

  if (!summary) {
    return (
      <StaffLayout>
        <p className="text-slate-500">Loading dashboard...</p>
      </StaffLayout>
    );
  }

  const tiles = [
    { label: 'Total Documents', value: summary.totalDocuments },
    { label: 'Pending', value: summary.pending },
    { label: 'In Progress', value: summary.inProgress },
    { label: 'Completed', value: summary.completed },
    { label: 'Offices', value: summary.totalOffices },
    { label: 'Services', value: summary.totalServices },
    { label: 'Active Users', value: summary.totalUsers },
    { label: 'Incoming / Outgoing', value: `${summary.incoming} / ${summary.outgoing}` },
  ];

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">Administrator Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {tiles.map((tile) => (
          <div key={tile.label} className="bg-tra-yellow rounded-xl shadow p-5">
            <div className="text-2xl font-bold text-tra-black">{tile.value}</div>
            <div className="text-sm text-tra-black">{tile.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-slate-700 mb-3">Recent Documents</h2>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Reference No</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Department</th>
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
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No documents registered yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}
