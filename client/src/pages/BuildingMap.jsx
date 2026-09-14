import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getOffice } from '../api';

export default function BuildingMap() {
  const [searchParams] = useSearchParams();
  const officeId = searchParams.get('office');
  const [office, setOffice] = useState(null);

  useEffect(() => {
    if (officeId) getOffice(officeId).then(setOffice);
    else setOffice(null);
  }, [officeId]);

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-2">Building Map</h2>
        {office ? (
          <p className="text-slate-600 mb-6">
            Destination: <span className="font-semibold text-tra-black">{office.name}</span> — Office {office.officeNumber}, {office.floor}{office.wing ? `, ${office.wing}` : ''}
          </p>
        ) : (
          <p className="text-slate-600 mb-6">Select an office from the directory to highlight it on the map.</p>
        )}

        <div className="bg-white rounded-2xl shadow p-6 border-2 border-dashed border-slate-300 min-h-[400px] flex items-center justify-center text-slate-400">
          Floor map placeholder — replace with the actual building floor plan (SVG/image) and highlight the destination office.
        </div>
      </div>
    </KioskLayout>
  );
}
