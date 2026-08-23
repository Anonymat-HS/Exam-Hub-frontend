import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, FileText, Award, LogOut, Menu, X } from 'lucide-react';

const STUDENT_NAV_ITEMS = [
  { to: '/student', label: 'Accueil', icon: Home, end: true },
  { to: '/student/exams', label: 'Examens', icon: FileText },
  { to: '/student/results', label: 'Mes résultats', icon: Award },
];

export function StudentLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = { name: 'Alice Martin' };
  const logout = () => console.log('Simulation de déconnexion');

  const getInitials = (name) => {
    if (!name) return 'AM';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const fullName = user.name;
  const initials = getInitials(fullName);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 flex-col md:flex-row">
      
      {/* BARRE DE NAVIGATION SUPÉRIEURE (UNIQUEMENT SUR MOBILE) */}
      <header className="flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 md:hidden z-50">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white text-sm shadow-sm">
            EH
          </div>
          <span className="text-base font-bold text-gray-900">Exam Hub</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* BARRE LATÉRALE (SIDEBAR) RESPONSIVE */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6 transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static
        ${isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full'}
      `}>
        <div>
          {/* Logo masqué sur mobile car déjà dans le header */}
          <div className="hidden md:flex mb-8 items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white shadow-sm">
              EH
            </div>
            <span className="text-lg font-bold text-gray-900">Exam Hub</span>
          </div>

          <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 ring-1 ring-gray-100 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-400">Étudiant</p>
            </div>
          </div>

          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Navigation
          </p>
          <nav className="flex flex-col gap-1">
            {STUDENT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                      : 'text-gray-500 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={logout} 
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      {/* ARRIÈRE-PLAN SOMBRE QUAND LE MENU MOBILE EST OUVERT */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-gray-900/20 backdrop-blur-sm md:hidden"
        />
      )}


      <main className="flex-1 overflow-y-auto p-4 sm:p-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}
