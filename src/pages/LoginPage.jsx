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
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/student';
    navigate(redirectPath, { replace: true });
    return null;
  }

  async function handleLogin(email, password) {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const tokenPayload = JSON.parse(atob(localStorage.getItem('exam_hub_token').split('.')[1]));
      const role = tokenPayload?.role;
      navigate(role === 'ADMIN' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Erreur de connexion au serveur.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-violet-200">
            <span className="text-xl font-bold text-white">EH</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Exam Hub</h1>
          <p className="mt-1 text-sm text-gray-500">Connectez-vous à votre compte</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}
