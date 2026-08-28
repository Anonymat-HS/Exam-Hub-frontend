import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../api/api';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/student/exams', { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser.role === 'admin' ? '/admin' : '/student/exams', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl bg-white shadow-xl overflow-hidden min-h-[600px]">

        <div className="bg-primary-600 p-8 sm:p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div>
            <div className="flex items-center gap-3">
              <img src="/Icone-EH.png" alt="Exam Hub" className="h-10 w-10 rounded-xl object-contain shadow-sm" />
              <span className="text-xl font-bold tracking-tight">Exam Hub</span>
            </div>

            <div className="mt-16 sm:mt-20">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-200">
                Votre espace d'examens
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
                Passez vos examens en toute simplicité.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-primary-100 leading-relaxed">
                Une expérience moderne pour organiser, passer et consulter vos évaluations.
              </p>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-2 text-xs font-medium text-primary-200">
            <Sparkles size={16} />
            <span>Une expérience pensée pour vous.</span>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Bienvenue
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mt-1">
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
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-navy placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-600 transition-all outline-none"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 pr-10 text-sm text-navy placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-600 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-gray-400 transition-colors hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
