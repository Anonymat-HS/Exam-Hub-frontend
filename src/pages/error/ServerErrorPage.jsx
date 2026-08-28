import { useNavigate, useLocation } from 'react-router-dom';
import { ServerCrash, Home, RefreshCw } from 'lucide-react';

export function ServerErrorPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const homePath = pathname.startsWith('/student') ? '/student' : pathname.startsWith('/admin') ? '/admin' : '/login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500">
          <ServerCrash size={40} />
        </div>

        <h1 className="mt-6 text-6xl font-black text-gray-900">500</h1>

        <p className="mt-3 text-lg font-semibold text-gray-700">Erreur serveur</p>

        <p className="mt-2 max-w-sm text-sm text-gray-400 leading-relaxed">
          Une erreur inattendue est survenue sur nos serveurs. Veuillez réessayer dans quelques instants.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 cursor-pointer"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>

          <button
            type="button"
            onClick={() => navigate(homePath)}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            <Home size={16} />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}
