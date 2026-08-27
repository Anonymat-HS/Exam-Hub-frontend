import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreenPage } from './pages/SplashScreenPage';
import { LoginPage } from './pages/LoginPage';
import { RoleRoute } from './routes/RoleRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { StudentsPage } from './pages/admin/StudentsPage';
import { CoursesPage } from './pages/admin/CoursesPage';
import { ExamsPage } from './pages/admin/ExamsPage';
import { QuestionsPage } from './pages/admin/QuestionsPage';
import { ExamResultsPage } from './pages/admin/ExamResultsPage';
import { StudentLayout } from './layouts/StudentLayout';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { ExamStudentPage } from './pages/student/ExamStudentPage';
import { TakeExamPage } from './pages/student/TakeExamPage';
import { StudentResultsPage } from './pages/student/StudentResultsPage';
import { ExamResultPage } from './pages/student/ExamResultPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreenPage />} />
        <Route path="/login" element={<LoginPage />} />

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

        <Route element={<RoleRoute allowedRole="STUDENT" />}>
          <Route element={<StudentLayout />}>
            <Route path="/student" element={<StudentDashboardPage />} />
            <Route path="/student/exams" element={<ExamStudentPage />} />
            <Route path="/student/exams/:examId" element={<TakeExamPage />} />
            <Route path="/student/results" element={<StudentResultsPage />} />
            <Route path="/student/results/:examId" element={<ExamResultPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
