import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';

export default function FileTracking() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    staffApi.get('/documents', { params: { status: 'in-transit' } }).then((r) => setDocuments(r.data));
  }, []);

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">File Tracking — Currently In Transit</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">Reference No</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Currently With</th>
              <th className="px-4 py-2">Department</th>
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
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No files currently in transit.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}
