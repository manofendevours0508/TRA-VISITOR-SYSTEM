import { useEffect, useState } from 'react';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', startDate: '', endDate: '' });

  const load = () => staffApi.get('/announcements/all').then((r) => setAnnouncements(r.data));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await staffApi.post('/announcements', form);
    setForm({ title: '', message: '', startDate: '', endDate: '' });
    setShowForm(false);
    load();
  };

  const toggleStatus = async (a) => {
    await staffApi.put(`/announcements/${a.id}`, { status: a.status === 'active' ? 'inactive' : 'active' });
    load();
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete announcement "${a.title}"?`)) return;
    await staffApi.delete(`/announcements/${a.id}`);
    load();
  };

  return (
    <StaffLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-tra-black">Announcements</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-tra-yellow text-tra-black px-4 py-2 rounded-lg font-semibold hover:bg-tra-yellow-dark">
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-tra-yellow rounded-xl shadow p-6 mb-8 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-tra-black mb-1">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-tra-black mb-1">Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">Start Date</label>
            <input required type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">End Date</label>
            <input required type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" />
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800">
              Publish
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-xl shadow p-4 flex items-start justify-between">
            <div>
              <div className="font-semibold text-tra-black">{a.title}</div>
              <div className="text-slate-600 text-sm">{a.message}</div>
              <div className="text-xs text-slate-400 mt-1">
                {new Date(a.startDate).toLocaleDateString()} – {new Date(a.endDate).toLocaleDateString()} · {a.status}
              </div>
            </div>
            <div className="space-x-3 shrink-0 ml-4">
              <button onClick={() => toggleStatus(a)} className="text-tra-black hover:underline text-xs">
                {a.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => remove(a)} className="text-red-600 hover:underline text-xs">Delete</button>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-slate-400">No announcements yet.</p>}
      </div>
    </StaffLayout>
  );
}
