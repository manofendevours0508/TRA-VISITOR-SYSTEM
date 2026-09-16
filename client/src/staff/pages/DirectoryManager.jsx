import { useEffect, useState } from 'react';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';

export default function DirectoryManager() {
  const [departments, setDepartments] = useState([]);
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [officeForm, setOfficeForm] = useState({ name: '', officeNumber: '', floor: '', wing: '', contactInfo: '', departmentId: '' });
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', requirements: '', procedure: '', officeId: '' });

  const allOffices = departments.flatMap((d) => d.offices.map((o) => ({ ...o, departmentName: d.name })));

  const load = () => staffApi.get('/departments').then((r) => setDepartments(r.data));

  useEffect(() => { load(); }, []);

  const handleCreateOffice = async (e) => {
    e.preventDefault();
    await staffApi.post('/offices', officeForm);
    setOfficeForm({ name: '', officeNumber: '', floor: '', wing: '', contactInfo: '', departmentId: '' });
    setShowOfficeForm(false);
    load();
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    await staffApi.post('/services', serviceForm);
    setServiceForm({ name: '', description: '', requirements: '', procedure: '', officeId: '' });
    setShowServiceForm(false);
    load();
  };

  const deleteOffice = async (office) => {
    if (!window.confirm(`Delete office "${office.name}"? This also removes its services.`)) return;
    await staffApi.delete(`/offices/${office.id}`);
    load();
  };

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">Office & Service Directory</h1>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setShowOfficeForm((v) => !v)} className="bg-tra-yellow text-tra-black px-4 py-2 rounded-lg font-semibold hover:bg-tra-yellow-dark">
          {showOfficeForm ? 'Cancel' : '+ New Office'}
        </button>
        <button onClick={() => setShowServiceForm((v) => !v)} className="bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800">
          {showServiceForm ? 'Cancel' : '+ New Service'}
        </button>
      </div>

      {showOfficeForm && (
        <form onSubmit={handleCreateOffice} className="bg-tra-yellow rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <input required placeholder="Office name" value={officeForm.name} onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input required placeholder="Office number" value={officeForm.officeNumber} onChange={(e) => setOfficeForm({ ...officeForm, officeNumber: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input required placeholder="Floor" value={officeForm.floor} onChange={(e) => setOfficeForm({ ...officeForm, floor: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder="Wing" value={officeForm.wing} onChange={(e) => setOfficeForm({ ...officeForm, wing: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder="Contact info" value={officeForm.contactInfo} onChange={(e) => setOfficeForm({ ...officeForm, contactInfo: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <select required value={officeForm.departmentId} onChange={(e) => setOfficeForm({ ...officeForm, departmentId: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white">
            <option value="">— Department —</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div className="col-span-2">
            <button type="submit" className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800">Save Office</button>
          </div>
        </form>
      )}

      {showServiceForm && (
        <form onSubmit={handleCreateService} className="bg-tra-yellow rounded-xl shadow p-6 mb-8 grid grid-cols-2 gap-4">
          <input required placeholder="Service name" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2" />
          <textarea placeholder="Description" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2" rows={2} />
          <textarea placeholder="Required documents (one per line)" value={serviceForm.requirements} onChange={(e) => setServiceForm({ ...serviceForm, requirements: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          <textarea placeholder="Procedure steps (one per line)" value={serviceForm.procedure} onChange={(e) => setServiceForm({ ...serviceForm, procedure: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          <select required value={serviceForm.officeId} onChange={(e) => setServiceForm({ ...serviceForm, officeId: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2">
            <option value="">— Office —</option>
            {allOffices.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.departmentName})</option>)}
          </select>
          <div className="col-span-2">
            <button type="submit" className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800">Save Service</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {departments.map((dept) => (
          <div key={dept.id}>
            <h2 className="text-lg font-semibold text-slate-700 mb-2">{dept.name}</h2>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-2">Office</th>
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Floor</th>
                    <th className="px-4 py-2">Services</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dept.offices.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-tra-yellow transition-colors">
                      <td className="px-4 py-2">{o.name}</td>
                      <td className="px-4 py-2">{o.officeNumber}</td>
                      <td className="px-4 py-2">{o.floor}</td>
                      <td className="px-4 py-2">{o.services?.length ?? 0}</td>
                      <td className="px-4 py-2">
                        <button onClick={() => deleteOffice(o)} className="text-red-600 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {dept.offices.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-400">No offices in this department.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </StaffLayout>
  );
}
