import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';
import { useLanguage } from '../../i18n/LanguageContext';

const STATUS_OPTIONS = ['pending', 'in-progress', 'in-transit', 'completed', 'archived'];

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [users, setUsers] = useState([]);
  const [transferTo, setTransferTo] = useState('');
  const [remarks, setRemarks] = useState('');
  const { t } = useLanguage();

  const load = () => {
    staffApi.get(`/documents/${id}`).then((r) => setDoc(r.data));
  };

  useEffect(() => {
    load();
    staffApi.get('/users').then((r) => setUsers(r.data)).catch(() => setUsers([]));
  }, [id]);

  const handleStatusChange = async (status) => {
    await staffApi.patch(`/documents/${id}`, { status });
    load();
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferTo) return;
    await staffApi.post(`/documents/${id}/movements`, { toUserId: transferTo, remarks });
    setTransferTo('');
    setRemarks('');
    load();
  };

  const handleReceive = async (movementId) => {
    await staffApi.post(`/documents/${id}/movements/${movementId}/receive`);
    load();
  };

  if (!doc) {
    return <StaffLayout><p className="text-slate-500">{t('loading')}</p></StaffLayout>;
  }

  return (
    <StaffLayout>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <p className="text-sm uppercase text-slate-400">{doc.documentType}</p>
          <h1 className="text-2xl font-bold text-tra-black mb-4">{doc.subject}</h1>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <Info label={t('referenceNo')} value={doc.referenceNo} />
            <Info label={t('status')} value={doc.status} />
            <Info label={t('sender')} value={doc.sender || '—'} />
            <Info label={t('recipient')} value={doc.recipient || '—'} />
            <Info label={t('department')} value={doc.department?.name || '—'} />
            <Info label={t('assignedTo')} value={doc.assignedTo?.fullName || '—'} />
            <Info label={t('registered')} value={new Date(doc.createdAt).toLocaleString()} />
            {doc.filePath && (
              <div>
                <div className="text-xs uppercase text-slate-400">{t('attachment')}</div>
                <a href={doc.filePath} target="_blank" rel="noreferrer" className="text-tra-black hover:underline">
                  {t('viewScannedDocument')}
                </a>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('updateStatus')}</label>
            <select
              value={doc.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <h2 className="text-lg font-semibold text-slate-700 mb-3">{t('fileMovementHistory')}</h2>
          <div className="space-y-2">
            {doc.movements?.map((m) => (
              <div key={m.id} className="border rounded-lg p-3 text-sm flex items-center justify-between">
                <div>
                  <span className="font-medium">{m.fromUser?.fullName || 'Registry'}</span>
                  {' → '}
                  <span className="font-medium">{m.toUser?.fullName}</span>
                  <div className="text-slate-500">
                    {t('sent')} {new Date(m.dateSent).toLocaleString()}
                    {m.dateReceived && ` · ${t('received')} ${new Date(m.dateReceived).toLocaleString()}`}
                    {m.remarks && ` · ${m.remarks}`}
                  </div>
                </div>
                {!m.dateReceived && (
                  <button
                    onClick={() => handleReceive(m.id)}
                    className="text-tra-black hover:underline text-xs shrink-0 ml-3"
                  >
                    {t('markReceived')}
                  </button>
                )}
              </div>
            ))}
            {(!doc.movements || doc.movements.length === 0) && (
              <p className="text-slate-400 text-sm">{t('noMovementsRecorded')}</p>
            )}
          </div>
        </div>

        <div className="bg-tra-yellow rounded-xl shadow p-6 h-fit">
          <h2 className="text-lg font-semibold text-tra-black mb-3">{t('transferAssign')}</h2>
          <form onSubmit={handleTransfer} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-tra-black mb-1">{t('to')}</label>
              <select
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
              >
                <option value="">{t('selectOfficer')}</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-tra-black mb-1">{t('remarks')}</label>
              <input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-tra-black text-tra-yellow py-2 rounded-lg font-semibold hover:bg-slate-800"
            >
              {t('transfer')}
            </button>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{label}</div>
      <div className="font-medium text-slate-800 capitalize">{value}</div>
    </div>
  );
}