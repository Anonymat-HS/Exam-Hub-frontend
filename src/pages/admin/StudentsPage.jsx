import { useEffect, useState } from 'react';
import { Plus, Search, Users, UserX } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { studentService } from '../../services/studentService';
import { ApiError } from '../../services/api';

const DEMO_STUDENTS = [
  { id: 's1', firstName: 'Alice', lastName: 'Martin', email: 'alice@examhub.com', active: true },
  { id: 's2', firstName: 'Thomas', lastName: 'Dupont', email: 'thomas@examhub.com', active: true },
  { id: 's3', firstName: 'Sarah', lastName: 'Bernard', email: 'sarah@examhub.com', active: false },
];

const EMPTY_FORM = { fullName: '', email: '', password: '' };

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-600',
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
];

export function StudentsPage() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    studentService
      .getStudents()
      .then((data) => {
        if (Array.isArray(data)) setStudents(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const query = search.trim().toLowerCase();
  const filtered = students.filter(
    (s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) || s.email.toLowerCase().includes(query),
  );

  function openAddModal() {
    setForm(EMPTY_FORM);
    setErrors({});
    setIsSubmitting(false);
    setIsAddOpen(true);
  }

  async function runMutation(action) {
    try {
      await action();
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
        return false;
      }
      return true;
    }
  }

  async function handleDeactivateConfirmed() {
    if (!confirmTarget) return;
    setIsToggling(true);
    const ok = await runMutation(() => studentService.deactivateStudent(confirmTarget.id));
    setIsToggling(false);
    if (!ok) {
      setConfirmTarget(null);
      return;
    }
    setStudents((prev) => prev.map((s) => (s.id === confirmTarget.id ? { ...s, active: false } : s)));
    setConfirmTarget(null);
  }

  async function handleActivate(student) {
    setActionError('');
    const ok = await runMutation(() => studentService.activateStudent(student.id));
    if (!ok) return;
    setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, active: true } : s)));
  }

  function validateForm() {
    const next = {};
    const words = form.fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) next.fullName = 'Entrez le prénom et le nom.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Adresse email invalide.';
    } else if (students.some((s) => s.email.toLowerCase() === form.email.trim().toLowerCase())) {
      next.email = 'Cet email est déjà utilisé.';
    }
    if (form.password.length < 6) next.password = 'Mot de passe : 6 caractères minimum.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setActionError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    const [firstName, ...rest] = form.fullName.trim().split(/\s+/);
    const payload = { firstName, lastName: rest.join(' '), email: form.email.trim(), password: form.password };
    try {
      const created = await studentService.createStudent(payload);
      setStudents((prev) => [{ ...created, active: created.active ?? true }, ...prev]);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ email: err.status === 409 ? 'Cet email est déjà utilisé.' : err.message });
        setIsSubmitting(false);
        return;
      }
      setStudents((prev) => [{ id: `${Date.now()}`, ...payload, active: true }, ...prev]);
    }
    setIsSubmitting(false);
    setIsAddOpen(false);
    setForm(EMPTY_FORM);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Administration</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Étudiants</h1>
          <p className="mt-1 text-gray-500">Gérez les comptes de vos étudiants.</p>
        </div>
        <Button variant="violet" onClick={openAddModal}>
          <Plus size={16} /> Ajouter
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-6 pb-4">
          <Input
            icon={Search}
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un étudiant par nom ou email"
            className="w-full sm:max-w-xs"
          />
          <p className="text-sm text-gray-500">{filtered.length} étudiant(s)</p>
        </div>

        {!isLoading && <ErrorMessage message={actionError} onRetry={() => setActionError('')} />}

        {isLoading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          students.length === 0 ? (
            <EmptyState icon={Users} title="Aucun étudiant" description="Ajoutez votre premier étudiant avec le bouton « Ajouter »." />
          ) : (
            <EmptyState icon={UserX} title="Aucun résultat" description={`Aucun étudiant ne correspond à « ${search} ».`} />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-400">
                  <th scope="col" className="px-6 py-3 font-medium">Étudiant</th>
                  <th scope="col" className="px-6 py-3 font-medium">Email</th>
                  <th scope="col" className="px-6 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, index) => (
                  <tr key={student.id} className="border-t border-gray-50 transition-colors hover:bg-gray-50/70">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}
                        >
                          {`${student.firstName[0]}${student.lastName[0]}`.toUpperCase()}
                        </span>
                        <span className="font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${student.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        {student.active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.active ? (
                        <button
                          onClick={() => setConfirmTarget(student)}
                          className="rounded-lg px-2.5 py-1.5 font-medium text-red-500 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                        >
                          Désactiver
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(student)}
                          className="rounded-lg px-2.5 py-1.5 font-medium text-green-600 transition-colors hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
                        >
                          Réactiver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Ajouter un étudiant">
        <form onSubmit={handleCreate} className="flex flex-col gap-4" noValidate>
          <Input
            id="fullName"
            label="Nom complet"
            placeholder="Jean Dupont"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
            autoFocus
          />
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="jean@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <Button type="submit" variant="violet" loading={isSubmitting} className="mt-1 w-full">
            Créer le compte
          </Button>
        </form>
      </Modal>

      <Modal open={Boolean(confirmTarget)} onClose={() => setConfirmTarget(null)} title="Désactiver cet étudiant ?">
        <p className="text-sm text-gray-500">
          Le compte de{' '}
          <span className="font-semibold text-gray-900">
            {confirmTarget && `${confirmTarget.firstName} ${confirmTarget.lastName}`}
          </span>{' '}
          sera désactivé. Il ne pourra plus se connecter à la plateforme.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" loading={isToggling} onClick={handleDeactivateConfirmed}>
            Désactiver
          </Button>
        </div>
      </Modal>
    </div>
  );
}
