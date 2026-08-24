import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RoleRoute } from './routes/RoleRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { StudentsPage } from './pages/admin/StudentsPage';
import { CoursesPage } from './pages/admin/CoursesPage';
import { ExamsPage } from './pages/admin/ExamsPage';
import { QuestionsPage } from './pages/admin/QuestionsPage';
import { ExamResultsPage } from './pages/admin/ExamResultsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route element={<RoleRoute allowedRole="ADMIN" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/students" element={<StudentsPage />} />
            <Route path="/admin/courses" element={<CoursesPage />} />
            <Route path="/admin/exams" element={<ExamsPage />} />
            <Route path="/admin/exams/:examId/questions" element={<QuestionsPage />} />
            <Route path="/admin/exams/:examId/results" element={<ExamResultsPage />} />
            <Route path="/admin/results" element={<ExamResultsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
