import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { StudentLayout } from '../layouts/StudentLayout';

import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { ExamStudentPage } from '../pages/student/ExamStudentPage';
import { TakeExamPage } from '../pages/student/TakeExamPage';
import { StudentResultsPage } from '../pages/student/StudentResultsPage';
import { ExamResultPage } from '../pages/student/ExamResultPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/student" replace />} />

          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="exams" element={<ExamStudentPage />} />
            <Route path="exams/:examId" element={<TakeExamPage />} />
            <Route path="results" element={<StudentResultsPage />} />
            <Route path="results/:examId" element={<ExamResultPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
