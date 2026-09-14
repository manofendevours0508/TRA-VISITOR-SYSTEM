import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/staff/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <div className="p-8 text-center text-red-600">You do not have permission to view this page.</div>;
  }
  return children;
}
