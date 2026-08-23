import { Outlet } from 'react-router-dom';

export function StudentLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8"><Outlet /></main>
    </div>
  );
}
