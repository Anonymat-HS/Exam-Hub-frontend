import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.jsx';
import { StudentLayout } from './layouts/StudentLayout.jsx';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage.jsx';
import { ExamStudentPage } from './pages/student/ExamStudentPage.jsx';
import { TakeExamPage } from './pages/student/TakeExamPage.jsx';
import { StudentResultsPage } from './pages/student/StudentResultsPage.jsx';
import { ExamResultPage } from './pages/student/ExamResultPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="exams" element={<ExamStudentPage />} />
          <Route path="exams/:examId" element={<TakeExamPage />} />
          <Route path="results" element={<StudentResultsPage />} />
          <Route path="results/:examId" element={<ExamResultPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}