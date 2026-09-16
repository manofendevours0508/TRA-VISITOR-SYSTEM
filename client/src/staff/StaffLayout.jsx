import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

export default function StaffLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: '/staff/dashboard', label: t('dashboard') },
    { to: '/staff/incoming', label: t('incomingRegister') },
    { to: '/staff/outgoing', label: t('outgoingRegister') },
    { to: '/staff/tracking', label: t('fileTracking') },
    { to: '/staff/search', label: t('documentSearch') },
    { to: '/staff/directory', label: t('officeServiceDirectory') },
    { to: '/staff/announcements', label: t('announcements') },
    { to: '/staff/users', label: t('users'), adminOnly: true },
    { to: '/staff/audit-log', label: t('auditLog'), roles: ['System Administrator', 'Supervisor', 'Management'] },
  ];

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly) return user?.role === 'System Administrator';
    if (item.roles) return item.roles.includes(user?.role);
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-tra-black text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-tra-yellow">
          <div className="font-bold text-lg leading-tight"><span className="text-tra-yellow">TRA</span>-DIRECT</div>
          <div className="text-xs text-slate-400">{t('staffRegistryPortal')}</div>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-5 py-2.5 text-sm ${isActive ? 'bg-tra-yellow text-tra-black font-semibold' : 'hover:bg-slate-800 text-slate-200'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-slate-800 text-sm space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{user?.fullName}</div>
              <div className="text-slate-400 text-xs">{user?.role}</div>
            </div>
            <LanguageToggle />
          </div>
          <button
            onClick={() => { logout(); navigate('/staff/login'); }}
            className="text-slate-400 hover:text-white text-xs underline"
          >
            {t('logOut')}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}