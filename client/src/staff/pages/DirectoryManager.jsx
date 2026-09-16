import { useEffect, useState } from 'react';
import StaffLayout from '../StaffLayout';
import staffApi from '../staffApi';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DirectoryManager() {
  const [departments, setDepartments] = useState([]);
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [officeForm, setOfficeForm] = useState({ name: '', nameSw: '', officeNumber: '', floor: '', floorSw: '', wing: '', wingSw: '', contactInfo: '', departmentId: '' });
  const [serviceForm, setServiceForm] = useState({ name: '', nameSw: '', description: '', descriptionSw: '', requirements: '', requirementsSw: '', procedure: '', procedureSw: '', officeId: '' });
  const { t } = useLanguage();

  const allOffices = departments.flatMap((d) => d.offices.map((o) => ({ ...o, departmentName: d.name })));

  const load = () => staffApi.get('/departments').then((r) => setDepartments(r.data));

  useEffect(() => { load(); }, []);

  const handleCreateOffice = async (e) => {
    e.preventDefault();
    await staffApi.post('/offices', officeForm);
    setOfficeForm({ name: '', nameSw: '', officeNumber: '', floor: '', floorSw: '', wing: '', wingSw: '', contactInfo: '', departmentId: '' });
    setShowOfficeForm(false);
    load();
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    await staffApi.post('/services', serviceForm);
    setServiceForm({ name: '', nameSw: '', description: '', descriptionSw: '', requirements: '', requirementsSw: '', procedure: '', procedureSw: '', officeId: '' });
    setShowServiceForm(false);
    load();
  };

  const deleteOffice = async (office) => {
    if (!window.confirm(`${t('deleteAction')} "${office.name}"? ${t('deleteOfficeServicesNote')}`)) return;
    await staffApi.delete(`/offices/${office.id}`);
    load();
  };

  return (
    <StaffLayout>
      <h1 className="text-2xl font-bold text-tra-black mb-6">{t('officeServiceDirectoryTitle')}</h1>

      <div className="flex gap-3 mb-6">
        <button onClick={() => setShowOfficeForm((v) => !v)} className="bg-tra-yellow text-tra-black px-4 py-2 rounded-lg font-semibold hover:bg-tra-yellow-dark">
          {showOfficeForm ? t('cancel') : t('newOffice')}
        </button>
        <button onClick={() => setShowServiceForm((v) => !v)} className="bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800">
          {showServiceForm ? t('cancel') : t('newService')}
        </button>
      </div>

      {showOfficeForm && (
        <form onSubmit={handleCreateOffice} className="bg-tra-yellow rounded-xl shadow p-6 mb-6 grid grid-cols-2 gap-4">
          <input required placeholder={t('officeNamePlaceholder')} value={officeForm.name} onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder={`${t('officeNamePlaceholder')} (Kiswahili)`} value={officeForm.nameSw} onChange={(e) => setOfficeForm({ ...officeForm, nameSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input required placeholder={t('officeNumberPlaceholder')} value={officeForm.officeNumber} onChange={(e) => setOfficeForm({ ...officeForm, officeNumber: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input required placeholder={t('floorPlaceholder')} value={officeForm.floor} onChange={(e) => setOfficeForm({ ...officeForm, floor: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder={`${t('floorPlaceholder')} (Kiswahili)`} value={officeForm.floorSw} onChange={(e) => setOfficeForm({ ...officeForm, floorSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder={t('wingPlaceholder')} value={officeForm.wing} onChange={(e) => setOfficeForm({ ...officeForm, wing: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder={`${t('wingPlaceholder')} (Kiswahili)`} value={officeForm.wingSw} onChange={(e) => setOfficeForm({ ...officeForm, wingSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <input placeholder={t('contactInfoPlaceholder')} value={officeForm.contactInfo} onChange={(e) => setOfficeForm({ ...officeForm, contactInfo: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" />
          <select required value={officeForm.departmentId} onChange={(e) => setOfficeForm({ ...officeForm, departmentId: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white">
            <option value="">{t('departmentPlaceholder')}</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div className="col-span-2">
            <button type="submit" className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800">{t('saveOffice')}</button>
          </div>
        </form>
      )}

      {showServiceForm && (
        <form onSubmit={handleCreateService} className="bg-tra-yellow rounded-xl shadow p-6 mb-8 grid grid-cols-2 gap-4">
          <input required placeholder={t('serviceNamePlaceholder')} value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2" />
          <input placeholder={`${t('serviceNamePlaceholder')} (Kiswahili)`} value={serviceForm.nameSw} onChange={(e) => setServiceForm({ ...serviceForm, nameSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2" />
          <textarea placeholder={t('descriptionPlaceholder')} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2" rows={2} />
          <textarea placeholder={`${t('descriptionPlaceholder')} (Kiswahili)`} value={serviceForm.descriptionSw} onChange={(e) => setServiceForm({ ...serviceForm, descriptionSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2" rows={2} />
          <textarea placeholder={t('requirementsPlaceholder')} value={serviceForm.requirements} onChange={(e) => setServiceForm({ ...serviceForm, requirements: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          <textarea placeholder={t('procedurePlaceholder')} value={serviceForm.procedure} onChange={(e) => setServiceForm({ ...serviceForm, procedure: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          <textarea placeholder={`${t('requirementsPlaceholder')} (Kiswahili)`} value={serviceForm.requirementsSw} onChange={(e) => setServiceForm({ ...serviceForm, requirementsSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          <textarea placeholder={`${t('procedurePlaceholder')} (Kiswahili)`} value={serviceForm.procedureSw} onChange={(e) => setServiceForm({ ...serviceForm, procedureSw: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white" rows={3} />
          <select required value={serviceForm.officeId} onChange={(e) => setServiceForm({ ...serviceForm, officeId: e.target.value })} className="border border-tra-black rounded-lg px-3 py-2 bg-white col-span-2">
            <option value="">{t('officeSelectPlaceholder')}</option>
            {allOffices.map((o) => <option key={o.id} value={o.id}>{o.name} ({o.departmentName})</option>)}
          </select>
          <div className="col-span-2">
            <button type="submit" className="bg-tra-black text-tra-yellow px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800">{t('saveService')}</button>
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
                    <th className="px-4 py-2">{t('officeHeader')}</th>
                    <th className="px-4 py-2">{t('noHeader')}</th>
                    <th className="px-4 py-2">{t('floor')}</th>
                    <th className="px-4 py-2">{t('servicesHeader')}</th>
                    <th className="px-4 py-2">{t('actions')}</th>
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
                        <button onClick={() => deleteOffice(o)} className="text-red-600 hover:underline text-xs">{t('deleteAction')}</button>
                      </td>
                    </tr>
                  ))}
                  {dept.offices.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-4 text-center text-slate-400">{t('noOfficesInDept')}</td></tr>
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