import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export function LoginForm({ onSubmit, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  function validate() {
    const next = {};
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Adresse email invalide.';
    }
    if (!password) {
      next.password = 'Mot de passe requis.';
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(email.trim(), password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        id="login-email"
        label="Email"
        type="email"
        icon={Mail}
        placeholder="admin@examhub.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        autoFocus
        autoComplete="email"
      />
      <Input
        id="login-password"
        label="Mot de passe"
        type="password"
        icon={Lock}
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={fieldErrors.password}
        autoComplete="current-password"
      />
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}
      <Button
        type="submit"
        variant="violet"
        loading={loading}
        className="mt-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600"
      >
        Se connecter
      </Button>
    </form>
  );
}
