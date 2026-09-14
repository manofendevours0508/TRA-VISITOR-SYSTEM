import { useEffect, useState } from 'react';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    staffApi.get('/audit-logs').then((r) => setLogs(r.data));
  }, []);

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">Audit Log</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Record</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t hover:bg-tra-yellow transition-colors">
                <td className="px-4 py-2">{new Date(l.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{l.user?.fullName || 'System'}</td>
                <td className="px-4 py-2">{l.action}</td>
                <td className="px-4 py-2">{l.recordId || '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No audit entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}
