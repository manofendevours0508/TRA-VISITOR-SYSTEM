import { useEffect, useState } from 'react';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', username: '', password: '', roleId: '', departmentId: '' });
  const { t } = useLanguage();

  const load = () => staffApi.get('/users').then((r) => setUsers(r.data));

  useEffect(() => {
    load();
    staffApi.get('/users/roles').then((r) => setRoles(r.data));
    staffApi.get('/departments').then((r) => setDepartments(r.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await staffApi.post('/users', form);
    setForm({ fullName: '', username: '', password: '', roleId: '', departmentId: '' });
    setShowForm(false);
    load();
  };

  const toggleStatus = async (user) => {
    await staffApi.patch(`/users/${user.id}`, { status: user.status === 'active' ? 'disabled' : 'active' });
    load();
  };

  const resetPassword = async (user) => {
    const password = window.prompt(`${t('newPasswordPromptFor')} ${user.username}:`);
    if (!password) return;
    await staffApi.post(`/users/${user.id}/reset-password`, { password });
    window.alert(t('passwordResetSuccess'));
  };

  return (
    <StaffLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-tra-black">{t('userManagement')}</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-tra-yellow text-tra-black px-4 py-2 rounded-lg font-semibold hover:bg-tra-yellow-dark"
        >
          {showForm ? t('cancel') : t('newUser')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-tra-yellow rounded-xl shadow p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">{t('fullName')}</label>
            <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">{t('usernameLabel')}</label>
            <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">{t('passwordLabel')}</label>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">{t('createRole')}</label>
            <select required value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white">
              <option value="">{t('selectRole')}</option>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-tra-black mb-1">{t('department')}</label>
            <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} className="w-full border border-tra-black rounded-lg px-3 py-2 bg-white">
              <option value="">{t('none')}</option>
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <button type="submit" className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800">
              {t('createUser')}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">{t('name')}</th>
              <th className="px-4 py-2">{t('usernameHeader')}</th>
              <th className="px-4 py-2">{t('roleHeader')}</th>
              <th className="px-4 py-2">{t('department')}</th>
              <th className="px-4 py-2">{t('status')}</th>
              <th className="px-4 py-2">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-tra-yellow transition-colors">
                <td className="px-4 py-2">{u.fullName}</td>
                <td className="px-4 py-2">{u.username}</td>
                <td className="px-4 py-2">{u.role}</td>
                <td className="px-4 py-2">{u.department || '—'}</td>
                <td className="px-4 py-2 capitalize">{u.status}</td>
                <td className="px-4 py-2 space-x-3">
                  <button onClick={() => toggleStatus(u)} className="text-tra-black hover:underline text-xs">
                    {u.status === 'active' ? t('disable') : t('enable')}
                  </button>
                  <button onClick={() => resetPassword(u)} className="text-tra-black hover:underline text-xs">
                    {t('resetPassword')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </StaffLayout>
  );
}