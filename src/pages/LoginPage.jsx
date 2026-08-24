import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';



const useAuth = () => ({
  user: { role: 'STUDENT' },
  login: async () => {},
});
export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);

      // Orientation de l'utilisateur selon son rôle JWT
      const role = user?.role;

      if (role === 'ADMIN' || role === 'ROLE_ADMIN' || role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || 
        err?.message || 
        'Identifiants incorrects. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-white shadow-xl overflow-hidden min-h-[600px]">
        
        {/* Section de présentation du service */}
        <div className="bg-indigo-600 p-8 sm:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white text-indigo-600 font-extrabold flex items-center justify-center text-lg shadow-sm">
                EH
              </div>
              <span className="text-xl font-bold tracking-tight">Exam Hub</span>
            </div>

            <div className="mt-16 sm:mt-20">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Votre espace d'examens
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Passez vos examens en toute simplicité.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-indigo-100 leading-relaxed">
                Une expérience moderne pour organiser, passer et consulter vos évaluations.
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-2 text-xs font-medium text-indigo-200">
            <Sparkles size={16} />
            <span>Une expérience pensée pour vous.</span>
          </div>
        </div>

        {/* Formulaire d'authentification */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Bienvenue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Se connecter
            </h2>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@examhub.com"
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Se connecter <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}