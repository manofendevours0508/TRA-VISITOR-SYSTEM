import { useEffect, useState } from 'react';
import KioskLayout from '../components/KioskLayout';
import { getAnnouncements } from '../api';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    getAnnouncements().then(setAnnouncements);
  }, []);

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-6">Announcements</h2>
        {announcements.length === 0 && (
          <p className="text-slate-500">No active announcements.</p>
        )}
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl shadow p-5">
              <h3 className="text-lg font-semibold text-tra-black">{a.title}</h3>
              <p className="text-slate-600 mt-1">{a.message}</p>
            </div>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
}
