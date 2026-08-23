import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { StudentsPage } from './pages/admin/StudentsPage';
import { ExamResultsPage } from './pages/admin/ExamResultsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/results" element={<ExamResultsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}