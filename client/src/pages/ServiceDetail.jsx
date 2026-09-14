import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getService } from '../api';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getService(id).then(setService);
  }, [id]);

  if (!service) {
    return (
      <KioskLayout>
        <p className="text-center text-slate-500">Loading service...</p>
      </KioskLayout>
    );
  }

  const steps = (service.procedure || '').split('\n').filter(Boolean);
  const requirements = (service.requirements || '').split('\n').filter(Boolean);

  return (
    <KioskLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <p className="text-sm uppercase tracking-wide text-slate-500">Service</p>
        <h2 className="text-3xl font-bold text-tra-black mb-4">{service.name}</h2>
        {service.description && <p className="text-slate-600 mb-6">{service.description}</p>}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <InfoBox label="Office" value={service.office?.name} />
          <InfoBox label="Office No" value={service.office?.officeNumber} />
          <InfoBox label="Floor" value={service.office?.floor} />
        </div>

        {requirements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Required Documents</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              {requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {steps.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Procedure</h3>
            <ol className="list-decimal list-inside text-slate-700 space-y-1">
              {steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <Link
            to={`/office/${service.office?.id}`}
            className="flex-1 text-center bg-slate-100 text-tra-black py-4 rounded-xl text-lg font-semibold hover:bg-slate-200"
          >
            Office Details
          </Link>
          <button
            onClick={() => navigate(`/map?office=${service.office?.id}`)}
            className="flex-1 bg-tra-yellow text-tra-black py-4 rounded-xl text-lg font-semibold hover:bg-tra-yellow-dark"
          >
            View on Map
          </button>
          <img
            src={`/api/qr/service/${service.id}`}
            alt="Scan QR for this service"
            className="w-24 h-24 rounded-lg border"
          />
        </div>
      </div>
    </KioskLayout>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 text-center">
      <div className="text-xs uppercase text-slate-400">{label}</div>
      <div className="text-xl font-semibold text-tra-black">{value}</div>
    </div>
  );
}
