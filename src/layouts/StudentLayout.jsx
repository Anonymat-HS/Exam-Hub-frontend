import { NavLink, Outlet } from 'react-router-dom';
import { Home, FileText, Award, LogOut } from 'lucide-react';


const STUDENT_NAV_ITEMS = [
  { to: '/student', label: 'Accueil', icon: Home, end: true },
  { to: '/student/exams', label: 'Examens', icon: FileText },
  { to: '/student/results', label: 'Mes résultats', icon: Award },
];

export function StudentLayout() {

const logout = () => console.log("Déconnexion");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      <aside className="flex w-64 flex-col justify-between border-r border-gray-100 bg-white px-4 py-6">
        <div>
         
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 font-bold text-white shadow-sm">
              EH
            </div>
            <span className="text-lg font-bold text-gray-900">Exam Hub</span>
          </div>

          
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-gray-50 ring-1 ring-gray-100 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-semibold text-sm">
              AM
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Alice Martin</p>
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

      
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
