import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) return <div className="p-8 text-center text-slate-500">{t('loading')}</div>;
  if (!user) return <Navigate to="/staff/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <div className="p-8 text-center text-red-600">{t('noPermission')}</div>;
  }
  return children;
}