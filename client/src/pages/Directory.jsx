import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import KioskLayout from '../components/KioskLayout';
import { getDepartments } from '../api';
import { useLanguage } from '../i18n/LanguageContext';

export default function Directory() {
  const [departments, setDepartments] = useState([]);
  const { t, pick, lang } = useLanguage();

  useEffect(() => {
    getDepartments(lang).then(setDepartments);
  }, [lang]);

  return (
    <KioskLayout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-tra-black mb-6">{t('officeDirectoryTitle')}</h2>
        <div className="space-y-8">
          {departments.map((dept) => (
            <div key={dept.id}>
              <h3 className="text-lg font-semibold text-slate-700 mb-3">{pick(dept, 'name')}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {dept.offices.map((office) => (
                  <Link
                    key={office.id}
                    to={`/office/${office.id}`}
                    className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                  >
                    <div className="font-semibold text-tra-black">{pick(office, 'name')}</div>
                    <div className="text-slate-600 text-sm">
                      {t('officeNo')} {office.officeNumber} · {pick(office, 'floor')}
                      {office.wing ? ` · ${pick(office, 'wing')}` : ''}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </KioskLayout>
  );
}