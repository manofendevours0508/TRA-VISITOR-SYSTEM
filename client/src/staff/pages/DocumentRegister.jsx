import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DocumentRegister({ type }) {
  const [documents, setDocuments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    subject: '', sender: '', recipient: '', dateReceived: '', dateDispatched: '',
    deliveryMethod: '', departmentId: '', file: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const load = () => {
    staffApi.get('/documents', { params: { type } }).then((r) => setDocuments(r.data));
  };

  useEffect(() => {
    load();
    staffApi.get('/departments').then((r) => setDepartments(r.data));
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('documentType', type);
      data.append('subject', form.subject);
      if (form.sender) data.append('sender', form.sender);
      if (form.recipient) data.append('recipient', form.recipient);
      if (form.dateReceived) data.append('dateReceived', form.dateReceived);
      if (form.dateDispatched) data.append('dateDispatched', form.dateDispatched);
      if (form.deliveryMethod) data.append('deliveryMethod', form.deliveryMethod);
      if (form.departmentId) data.append('departmentId', form.departmentId);
      if (form.file) data.append('file', form.file);

      await staffApi.post('/documents', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ subject: '', sender: '', recipient: '', dateReceived: '', dateDispatched: '', deliveryMethod: '', departmentId: '', file: null });
      setShowForm(false);
      load();
    } finally {
      setSubmitting(false);
    }
  };

  const title = type === 'incoming' ? t('incomingCorrespondenceRegister') : t('outgoingCorrespondenceRegister');

  return (
    <StaffLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-tra-black">{title}</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-tra-yellow text-tra-black px-4 py-2 rounded-lg font-semibold hover:bg-tra-yellow-dark"
        >
          {showForm ? t('cancel') : type === 'incoming' ? t('newIncomingDocument') : t('newOutgoingDocument')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-tra-yellow rounded-xl shadow p-6 mb-8 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-tra-black mb-1">{t('subject')}</label>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">
              {type === 'incoming' ? t('sender') : t('recipient')}
            </label>
            <input
              value={type === 'incoming' ? form.sender : form.recipient}
              onChange={(e) => setForm({ ...form, [type === 'incoming' ? 'sender' : 'recipient']: e.target.value })}
              className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">{t('department')}</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
            >
              <option value="">{t('selectRole')}</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">
              {type === 'incoming' ? t('dateReceived') : t('dateDispatched')}
            </label>
            <input
              type="date"
              value={type === 'incoming' ? form.dateReceived : form.dateDispatched}
              onChange={(e) => setForm({ ...form, [type === 'incoming' ? 'dateReceived' : 'dateDispatched']: e.target.value })}
              className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
            />
          </div>

          {type === 'outgoing' && (
            <div>
              <label className="block text-sm font-medium text-tra-black mb-1">{t('deliveryMethod')}</label>
              <input
                value={form.deliveryMethod}
                onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
                placeholder={t('deliveryPlaceholder')}
              />
            </div>
          )}

          <div className="col-span-2">
            <label className="block text-sm font-medium text-tra-black mb-1">{t('attachScannedDocument')}</label>
            <input
              type="file"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? t('registering') : t('registerDocument')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">{t('referenceNo')}</th>
              <th className="px-4 py-2">{t('subject')}</th>
              <th className="px-4 py-2">{type === 'incoming' ? t('sender') : t('recipient')}</th>
              <th className="px-4 py-2">{t('department')}</th>
              <th className="px-4 py-2">{t('status')}</th>
              <th className="px-4 py-2">{t('date')}</th>
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
                <td className="px-4 py-2">{type === 'incoming' ? doc.sender : doc.recipient}</td>
                <td className="px-4 py-2">{doc.department?.name || '—'}</td>
                <td className="px-4 py-2 capitalize">{doc.status}</td>
                <td className="px-4 py-2">
                  {new Date(type === 'incoming' ? doc.dateReceived || doc.createdAt : doc.dateDispatched || doc.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-400">{t('noDocumentsRegistered')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}