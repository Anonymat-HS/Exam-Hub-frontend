import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, Users, BookOpen, FileText, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutGrid, end: true },
  { to: '/admin/students', label: 'Étudiants', icon: Users },
  { to: '/admin/courses', label: 'Cours', icon: BookOpen },
  { to: '/admin/exams', label: 'Examens', icon: FileText },
  { to: '/admin/results', label: 'Résultats', icon: BarChart2 },
];

export function AdminLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="flex w-64 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6">
        <div>
          <div className="mb-8 flex items-center gap-2 px-2">
            <img src="/Icone-EH.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
            <span className="text-lg font-bold text-navy">Exam Hub</span>
          </div>
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 ring-1 ring-primary-100 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-600"><Users size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-navy">Administrateur</p>
              <p className="text-xs text-gray-400 truncate max-w-[140px]">{user?.email ?? 'admin'}</p>
            </div>
          </div>
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Navigation</p>
          <nav aria-label="Navigation admin" className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors before:absolute before:left-0 before:h-5 before:w-1 before:rounded-full before:bg-primary-600 before:transition-opacity ${isActive ? 'bg-primary-50 text-primary-600 before:opacity-100' : 'text-gray-600 hover:bg-gray-50 before:opacity-0'}`}>
                <Icon size={18} />{label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <LogOut size={18} />Déconnexion
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8"><Outlet /></main>
    </div>
  );
}
