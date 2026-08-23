import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
            EH
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Exam Hub</h1>
            <p className="mt-1 text-sm text-gray-500">Plateforme de gestion d'examens QCM</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-1 mb-6 text-sm text-gray-500">Connectez-vous pour accéder à votre espace.</p>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Accès réservé aux comptes créés par l'administration.
        </p>
      </div>
    </div>
  );
}
