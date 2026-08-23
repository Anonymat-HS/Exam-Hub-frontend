import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { ApiError } from '../../services/api';

const EMPTY_FORM = { email: '', password: '' };

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "L'email est obligatoire.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Adresse email invalide.';
    if (!form.password) next.password = 'Le mot de passe est obligatoire.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const user = await login(form.email.trim(), form.password);
      navigate(user?.role === 'ADMIN' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : 'Serveur inaccessible. Vérifiez que le backend est démarré.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <ErrorMessage message={formError} />
      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="vous@examhub.com"
        autoComplete="email"
        autoFocus
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        error={errors.email}
      />
      <Input
        id="password"
        type="password"
        label="Mot de passe"
        placeholder="••••••••"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        error={errors.password}
      />
      <Button type="submit" variant="primary" loading={isSubmitting} className="mt-1 w-full bg-gradient-to-r from-indigo-600 to-violet-600">
        Se connecter
      </Button>
    </form>
  );
}
