import { useState } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';

export default function DocumentSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const { data } = await staffApi.get('/documents', { params: { q } });
    setResults(data);
  };

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">Document Search</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by reference number, subject, sender or recipient"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button type="submit" className="bg-tra-yellow text-tra-black px-6 py-2 rounded-lg font-semibold hover:bg-tra-yellow-dark">
          Search
        </button>
      </form>

      {results && (
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
              {results.map((doc) => (
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
              {results.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No documents matched your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </StaffLayout>
  );
}
