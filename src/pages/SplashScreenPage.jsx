import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function SplashScreenPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate(user.role === 'ADMIN' ? '/admin' : '/student', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy">
      <div className="animate-fade-in flex flex-col items-center gap-6">
        <img
          src="/Logo.png"
          alt="Exam Hub"
          className="h-28 w-28 rounded-3xl object-contain shadow-2xl shadow-black/30"
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Exam Hub</h1>
          <p className="mt-2 text-sm text-primary-300">GCM &middot; Examens &middot; Résultats</p>
        </div>
        <div className="mt-4">
          <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-primary-800 border-t-primary-400" />
        </div>
      </div>
    </div>
  );
}
