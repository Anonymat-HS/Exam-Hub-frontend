import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLoader } from '../components/common/BrandLoader';
import { AdminLayout } from '../layouts/AdminLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { LoginPage } from '../pages/LoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { StudentsPage } from '../pages/admin/StudentsPage';
import { CoursesPage } from '../pages/admin/CoursesPage';
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

function homePath(role) {
  return role === 'ADMIN' ? '/admin' : '/student';
}

function PublicRoute() {
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <BrandLoader />;
  if (isAuthenticated) return <Navigate to={homePath(role)} replace />;
  return <Outlet />;
}

function RootRedirect() {
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <BrandLoader />;
  return <Navigate to={isAuthenticated ? homePath(role) : '/login'} replace />;
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

        <Route
          element={
            <RoleRoute allow="STUDENT">
              <StudentLayout />
            </RoleRoute>
          }
        >
          <Route path="/student" element={<StudentDashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
