import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RoleRoute({ allow, children }) {
  const { role } = useAuth();
  const ownHome = role === 'ADMIN' ? '/admin' : '/student';
  if (role !== allow) return <Navigate to={ownHome} replace />;
  return children ?? <Outlet />;
}
