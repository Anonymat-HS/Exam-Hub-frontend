import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const homePath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'STUDENT' ? '/student' : '/login';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-500">
          <FileQuestion size={40} />
        </div>

        <h1 className="mt-6 text-6xl font-black text-gray-900">404</h1>

        <p className="mt-3 text-lg font-semibold text-gray-700">Page introuvable</p>

        <p className="mt-2 max-w-sm text-sm text-gray-400 leading-relaxed">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <button
          type="button"
          onClick={() => navigate(homePath)}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95 cursor-pointer"
        >
          <Home size={16} />
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
