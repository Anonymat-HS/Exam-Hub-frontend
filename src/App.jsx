import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudentLayout } from './layouts/StudentLayout.jsx';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { ExamStudentPage } from './pages/student/ExamStudentPage.jsx';
import { ExamResultPage } from './pages/student/ExamResultPage.jsx';
// import { LoginPage } from './pages/LoginPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/login" element={<LoginPage />} /> */}

        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="exams" element={<ExamStudentPage />} />
          <Route path="results" element={<div>Page des résultats bientôt disponible</div>} />
          <Route path="results/:examId" element={<ExamResultPage />} />
        </Route>

        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}