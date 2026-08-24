import { useState } from 'react';
import { Mail, Lock, Shield, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ErrorMessage } from '../common/ErrorMessage';

const ROLES = [
  { key: 'ADMIN', label: 'Administrateur', icon: Shield, desc: 'Gérer la plateforme' },
  { key: 'STUDENT', label: 'Étudiant', icon: GraduationCap, desc: 'Passer les examens' },
];

export function LoginForm({ onSubmit, error, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map(({ key, label, icon: Icon, desc }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedRole(key)}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${
              selectedRole === key
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-[10px] leading-tight opacity-70">{desc}</span>
          </button>
        ))}
      </div>

      <Input
        id="login-email"
        label="Email"
        type="email"
        icon={Mail}
        placeholder={selectedRole === 'ADMIN' ? 'admin@examhub.com' : 'etudiant@examhub.com'}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        autoFocus
        autoComplete="email"
      />
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-gray-700">Mot de passe</label>
        <div className="relative">
          <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className={`w-full rounded-lg border bg-white py-2 pl-9 pr-10 text-sm text-navy transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
              fieldErrors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-primary-400 focus:ring-primary-100'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            aria-label={showPassword ? 'Cacher le mot de passe' : 'Voir le mot de passe'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
      </div>
      <ErrorMessage message={error} />
      <Button
        type="submit"
        variant="violet"
        loading={loading}
        className="mt-1 w-full bg-gradient-to-r from-primary-600 to-primary-700"
      >
        Se connecter
      </Button>
    </form>
  );
}
