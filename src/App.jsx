import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudentLayout } from './layouts/StudentLayout.jsx';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { ExamStudentPage } from './pages/student/ExamStudentPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student" element={<StudentLayout />}>
          
          <Route index element={<StudentDashboardPage />} />
          
          <Route path="exams" element={<ExamStudentPage />} />
          <Route path="results" element={<div>Page des résultats bientôt disponible</div>} />
          
        </Route> 
      </Routes>
    </BrowserRouter>
  );
}
