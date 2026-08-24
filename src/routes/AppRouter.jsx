import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLoader } from '../components/common/BrandLoader';
import { AdminLayout } from '../layouts/AdminLayout';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { StudentsPage } from '../pages/admin/StudentsPage';
import { CoursesPage } from '../pages/admin/CoursesPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <BrandLoader />;
  if (isAuthenticated) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <BrandLoader />;
  return <Navigate to={isAuthenticated ? '/admin' : '/login'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <RoleRoute allow="ADMIN">
              <AdminLayout />
            </RoleRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/courses" element={<CoursesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
