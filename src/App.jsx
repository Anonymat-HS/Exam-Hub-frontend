import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudentLayout } from './layouts/StudentLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student" element={<StudentLayout />}>
          
        
        </Route> 
      </Routes>
    </BrowserRouter>
  );
}
