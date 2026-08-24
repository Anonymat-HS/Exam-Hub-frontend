import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import { ApiError } from '../services/api';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === 'ADMIN' ? '/admin' : '/student/exams', { replace: true });
    return null;
  }

  async function handleLogin(email, password) {
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser.role === 'ADMIN' ? '/admin' : '/student/exams', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/Logo-general.png" alt="" className="mx-auto mb-4 h-14 w-14 rounded-2xl object-contain shadow-lg shadow-primary-200" />
          <h1 className="text-2xl font-bold tracking-tight text-navy">Exam Hub</h1>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous à votre compte</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}
