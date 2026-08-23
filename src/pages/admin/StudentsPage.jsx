import { useEffect, useState } from 'react';
import { Plus, Search, Users, UserX, UserCheck, UserPlus, X } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { studentService } from '../../services/studentService';
import { ApiError } from '../../services/api';

const DEMO_STUDENTS = [
  { id: 's1', ref: 'STD00001', firstName: 'Alice', lastName: 'Martin', email: 'alice@examhub.com', active: true },
  { id: 's2', ref: 'STD00002', firstName: 'Thomas', lastName: 'Dupont', email: 'thomas@examhub.com', active: true },
  { id: 's3', ref: 'STD00003', firstName: 'Sarah', lastName: 'Bernard', email: 'sarah@examhub.com', active: false },
];

const EMPTY_FORM = { fullName: '', email: '', password: '' };

const REF_PATTERN = /^STD(\d+)$/;
const makeRef = (n) => `STD${String(n).padStart(5, '0')}`;

function extractRefNumber(ref) {
  const match = REF_PATTERN.exec(ref || '');
  return match ? Number.parseInt(match[1], 10) : 0;
}

function nextRefNumber(list) {
  return Math.max(0, ...list.map((s) => extractRefNumber(s.ref))) + 1;
}

function withRefs(list) {
  let max = Math.max(0, ...list.map((s) => extractRefNumber(s.ref)));
  return list.map((s) => (s.ref ? s : { ...s, ref: makeRef(++max) }));
}

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-600',
  'bg-blue-100 text-blue-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
];

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'active', label: 'Actifs' },
  { value: 'inactive', label: 'Désactivés' },
];

function getAvatarClass(student, list) {
  const index = Math.max(list.findIndex((s) => s.id === student.id), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function Avatar({ student, list }) {
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ring-2 ring-white ${getAvatarClass(student, list)}`}>
      {`${student.firstName[0]}${student.lastName[0]}`.toUpperCase()}
    </span>
  );
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-5 p-6" role="status" aria-label="Chargement des étudiants">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex animate-pulse items-center gap-4">
          <span className="h-10 w-10 rounded-full bg-gray-100" />
          <span className="h-3.5 w-36 rounded-full bg-gray-100" />
          <span className="hidden h-3.5 flex-1 max-w-xs rounded-full bg-gray-100 sm:block" />
          <span className="ml-auto h-6 w-24 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function StudentsPage() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [actionError, setActionError] = useState('');
  const [lastAddedId, setLastAddedId] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    studentService
      .getStudents()
      .then((data) => {
        if (Array.isArray(data)) setStudents(withRefs(data));
        else setIsUsingMockData(true);
      })
      .catch(() => setIsUsingMockData(true))
      .finally(() => setIsLoading(false));
  }, []);

  const query = search.trim().toLowerCase();
  const filtered = students.filter((s) => {
    const matchesQuery =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) || s.email.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === 'all' || (statusFilter === 'active' ? s.active : !s.active);
    return matchesQuery && matchesStatus;
  });

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
      setStudents((prev) => [{ ...created, ref: created.ref ?? makeRef(nextRefNumber(prev)), active: created.active ?? true }, ...prev]);
      setLastAddedId(created?.id ?? null);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ email: err.status === 409 ? 'Cet email est déjà utilisé.' : err.message });
        setIsSubmitting(false);
        return;
      }
      const demoId = `${Date.now()}`;
      setStudents((prev) => [{ id: demoId, ref: makeRef(nextRefNumber(prev)), ...payload, active: true }, ...prev]);
      setLastAddedId(demoId);
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
        <Button
          variant="violet"
          onClick={openAddModal}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-200 transition-transform hover:-translate-y-0.5"
        >
          <Plus size={16} /> Ajouter
        </Button>
      </div>

      {isUsingMockData && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Données de démonstration affichées — le serveur backend est indisponible.
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-6 pb-4">
          <div className="relative w-full sm:max-w-xs">
            <Input
              icon={Search}
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Rechercher un étudiant par nom ou email"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-[30px] -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-gray-50 p-1">
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 ${
                  statusFilter === value ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="ml-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {filtered.length === 0 ? '0 étudiant' : filtered.length === 1 ? '1 étudiant' : `${filtered.length} étudiants`}
          </span>
        </div>

        {!isLoading && <ErrorMessage message={actionError} onRetry={() => setActionError('')} />}

        {isLoading ? (
          <SkeletonRows />
        ) : filtered.length === 0 ? (
          students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun étudiant"
              description="Ajoutez votre premier étudiant avec le bouton « Ajouter »."
              bubbleClass="bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-500"
            />
          ) : (
            <EmptyState
              icon={UserX}
              title="Aucun résultat"
              description={`Aucun étudiant ne correspond à votre recherche${statusFilter !== 'all' ? ' et au filtre sélectionné' : ''}.`}
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/60 text-left text-xs uppercase tracking-wider text-gray-400">
                  <th scope="col" className="px-6 py-3 font-medium">ID</th>
                  <th scope="col" className="px-6 py-3 font-medium">Étudiant</th>
                  <th scope="col" className="px-6 py-3 font-medium">Email</th>
                  <th scope="col" className="px-6 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-6 py-3 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-t border-gray-50 transition-colors hover:bg-gray-50/70 ${student.id === lastAddedId ? 'row-highlight' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-gray-50 px-2 py-1 font-mono text-xs text-gray-400">{student.ref ?? '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar student={student} list={students} />
                        <span className="font-medium text-gray-900">{`${student.firstName} ${student.lastName}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${student.email}`}
                        className="text-gray-500 underline-offset-2 transition-colors hover:text-indigo-600 hover:underline"
                      >
                        {student.email}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          student.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${student.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {student.active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {student.active ? (
                        <button
                          onClick={() => setConfirmTarget(student)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                        >
                          <UserX size={14} /> Désactiver
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(student)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-green-600 transition-colors hover:border-green-200 hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-200"
                        >
                          <UserCheck size={14} /> Réactiver
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

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Ajouter un étudiant" icon={UserPlus} tone="violet">
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
          <Button type="submit" variant="violet" loading={isSubmitting} className="mt-1 w-full bg-gradient-to-r from-violet-600 to-indigo-600">
            Créer le compte
          </Button>
        </form>
      </Modal>

      <Modal open={Boolean(confirmTarget)} onClose={() => setConfirmTarget(null)} title="Désactiver cet étudiant ?" icon={UserX} tone="danger">
        {confirmTarget && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <Avatar student={confirmTarget} list={students} />
            <div>
              <p className="font-mono text-xs text-gray-400">{confirmTarget.ref}</p>
              <p className="text-sm font-semibold text-gray-900">{`${confirmTarget.firstName} ${confirmTarget.lastName}`}</p>
              <p className="text-xs text-gray-400">{confirmTarget.email}</p>
            </div>
          </div>
        )}
        <p className="text-sm text-gray-500">Une fois désactivé, ce compte ne pourra plus se connecter à la plateforme. Vous pourrez le réactiver à tout moment.</p>
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
