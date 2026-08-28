import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, Users, BookOpen, FileText, BarChart2, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutGrid, end: true },
  { to: '/admin/students', label: 'Étudiants', icon: Users },
  { to: '/admin/courses', label: 'Cours', icon: BookOpen },
  { to: '/admin/exams', label: 'Examens', icon: FileText },
  { to: '/admin/results', label: 'Résultats', icon: BarChart2 },
];

function SidebarContent({ user, logout, onNavClick }) {
  return (
    <>
      <div>
        <div className="hidden md:flex mb-8 items-center gap-2 px-2">
          <img src="/Icone-EH.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
          <span className="text-lg font-bold text-navy">Exam Hub</span>
        </div>
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 ring-1 ring-primary-100 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Users size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy">Administrateur</p>
            <p className="text-xs text-gray-400 truncate max-w-[140px]">{user?.email ?? 'admin'}</p>
          </div>
        </div>
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Navigation</p>
        <nav aria-label="Navigation admin" className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onNavClick}
              className={({ isActive }) => `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors before:absolute before:left-0 before:h-5 before:w-1 before:rounded-full before:bg-primary-600 before:transition-opacity ${isActive ? 'bg-primary-50 text-primary-600 before:opacity-100' : 'text-gray-600 hover:bg-gray-50 before:opacity-0'}`}>
              <Icon size={18} className="shrink-0" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
        <LogOut size={18} className="shrink-0" /><span>Déconnexion</span>
      </button>
    </>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggleDrawer() {
    setDrawerOpen((prev) => !prev);
  }

  function closeDrawer() {
    setDrawerOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">

      {/* Mobile header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 md:hidden z-50">
        <div className="flex items-center gap-2">
          <img src="/Icone-EH.png" alt="" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-base font-bold text-navy">Exam Hub</span>
        </div>
        <button
          onClick={toggleDrawer}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50"
        >
          {drawerOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Tablet sidebar (md–lg) — icons only */}
      <aside className="hidden md:flex lg:hidden w-16 flex-col items-center justify-between border-r border-gray-100 bg-white py-6">
        <div className="flex flex-col items-center gap-6">
          <img src="/Icone-EH.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
          <nav aria-label="Navigation admin" className="flex flex-col gap-2">
            {NAV_ITEMS.map(({ to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => `flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Icon size={20} />
              </NavLink>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50">
          <LogOut size={20} />
        </button>
      </aside>

      {/* Mobile + Desktop sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6 transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${drawerOpen ? 'translate-x-0 pt-20' : '-translate-x-full'}
      `}>
        <SidebarContent user={user} logout={logout} onNavClick={closeDrawer} />
      </aside>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
