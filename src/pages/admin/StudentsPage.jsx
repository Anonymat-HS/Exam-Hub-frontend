import { useEffect, useState } from 'react';
import { Plus, Search, Users, UserX, UserCheck, UserPlus, X, Pencil } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { studentService } from '../../services/studentService';
import { ApiError } from '../../services/api';
import { MOCK_STUDENTS } from '../../data/mockData';

const EMPTY_CREATE_FORM = { fullName: '', email: '', password: '' };
const EMPTY_EDIT_FORM = { firstName: '', lastName: '', email: '', password: '' };

const AVATAR_COLORS = [
  'bg-primary-100 text-primary-600',
  'bg-primary-100 text-primary-600',
  'bg-primary-100 text-primary-600',
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
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);
  const [createErrors, setCreateErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [editErrors, setEditErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [actionError, setActionError] = useState('');
  const [lastAddedId, setLastAddedId] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    studentService
      .getStudents()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setStudents(data);
        else { setStudents(MOCK_STUDENTS); setIsUsingMockData(true); }
      })
      .catch(() => { setStudents(MOCK_STUDENTS); setIsUsingMockData(true); })
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
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateErrors({});
    setIsCreating(false);
    setIsAddOpen(true);
  }

  function openEditModal(student) {
    setEditForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      password: '',
    });
    setEditErrors({});
    setIsEditing(false);
    setEditTarget(student);
  }

  function validateCreateForm() {
    const next = {};
    const words = createForm.fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) next.fullName = 'Entrez le prénom et le nom.';
    if (!/^\S+@\S+\.\S+$/.test(createForm.email.trim())) {
      next.email = 'Adresse email invalide.';
    }
    if (createForm.password.length < 6) next.password = 'Mot de passe : 6 caractères minimum.';
    setCreateErrors(next);
    return Object.keys(next).length === 0;
  }

  function validateEditForm() {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(editForm.email.trim())) {
      next.email = 'Adresse email invalide.';
    }
    if (editForm.password && editForm.password.length < 6) {
      next.password = '6 caractères minimum.';
    }
    setEditErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setActionError('');
    if (!validateCreateForm()) return;
    setIsCreating(true);
    const [firstName, ...rest] = createForm.fullName.trim().split(/\s+/);
    const payload = { firstName, lastName: rest.join(' '), email: createForm.email.trim(), password: createForm.password };
    try {
      const created = await studentService.createStudent(payload);
      setStudents((prev) => [created, ...prev]);
      setLastAddedId(created?.id ?? null);
      setIsAddOpen(false);
      setCreateForm(EMPTY_CREATE_FORM);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setCreateErrors({ email: 'Cet email est déjà utilisé.' });
        } else if (err.status === 400) {
          setCreateErrors({ fullName: err.message });
        } else {
          setActionError(err.message);
        }
        setIsCreating(false);
        return;
      }
      setActionError('Erreur inattendue.');
      setIsCreating(false);
    }
  }

  async function handleEdit(e) {
    e.preventDefault();
    setActionError('');
    if (!validateEditForm()) return;
    setIsEditing(true);
    const payload = {
      email: editForm.email.trim(),
    };
    if (editForm.password) payload.password = editForm.password;
    try {
      const updated = await studentService.updateStudent(editTarget.id, payload);
      setStudents((prev) => prev.map((s) => (s.id === editTarget.id ? updated : s)));
      setEditTarget(null);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setEditErrors({ email: 'Cet email est déjà utilisé.' });
        } else if (err.status === 400) {
          setEditErrors({ firstName: err.message });
        } else {
          setActionError(err.message);
        }
        setIsEditing(false);
        return;
      }
      setActionError('Erreur inattendue.');
      setIsEditing(false);
    }
  }

  async function handleDeactivateConfirmed() {
    if (!confirmTarget) return;
    setIsToggling(true);
    setActionError('');
    try {
      await studentService.deactivateStudent(confirmTarget.id);
      setStudents((prev) => prev.map((s) => (s.id === confirmTarget.id ? { ...s, active: false } : s)));
      setConfirmTarget(null);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erreur lors de la désactivation.';
      setActionError(msg);
      setConfirmTarget(null);
    } finally {
      setIsToggling(false);
    }
  }

  async function handleActivate(student) {
    setActionError('');
    try {
      await studentService.activateStudent(student.id);
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, active: true } : s)));
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erreur lors de la réactivation.';
      setActionError(msg);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">Administration</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">Étudiants</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les comptes de vos étudiants.</p>
        </div>
        <Button
          variant="violet"
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-md shadow-primary-200 transition-transform hover:-translate-y-0.5"
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
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 border-b border-gray-100 p-4 sm:p-6 pb-4">
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
                className="absolute right-2.5 top-[30px] -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
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
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 ${
                  statusFilter === value ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <span className="sm:ml-auto rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
            {filtered.length === 0 ? '0 étudiant' : filtered.length === 1 ? '1 étudiant' : `${filtered.length} étudiants`}
          </span>
        </div>

        {!isLoading && actionError && <ErrorMessage message={actionError} onRetry={() => setActionError('')} />}

        {isLoading ? (
          <SkeletonRows />
        ) : filtered.length === 0 ? (
          students.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun étudiant"
              description="Ajoutez votre premier étudiant avec le bouton « Ajouter »."
              bubbleClass="bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500"
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
            {/* Mobile card view */}
            <div className="flex flex-col gap-3 p-4 md:hidden">
              {filtered.map((student) => (
                <div key={student.id} className={`rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100 ${student.id === lastAddedId ? 'row-highlight' : ''}`}>
                  <div className="flex items-center gap-3">
                    <Avatar student={student} list={students} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">{`${student.firstName} ${student.lastName}`}</p>
                      <p className="truncate text-xs text-gray-400">{student.email}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${student.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${student.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {student.active ? 'Actif' : 'Désactivé'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => openEditModal(student)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600">
                      <Pencil size={13} /> Modifier
                    </button>
                    {student.active ? (
                      <button onClick={() => setConfirmTarget(student)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-200 hover:bg-red-50">
                        <UserX size={13} /> Désactiver
                      </button>
                    ) : (
                      <button onClick={() => handleActivate(student)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-green-600 transition-colors hover:border-green-200 hover:bg-green-50">
                        <UserCheck size={13} /> Réactiver
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="bg-gray-50/60 text-left text-xs uppercase tracking-wider text-gray-400">
                  <th scope="col" className="px-6 py-3 font-medium">Étudiant</th>
                  <th scope="col" className="px-6 py-3 font-medium">Email</th>
                  <th scope="col" className="px-6 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-t border-gray-50 transition-colors hover:bg-gray-50/70 ${student.id === lastAddedId ? 'row-highlight' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar student={student} list={students} />
                        <span className="font-medium text-navy">{`${student.firstName} ${student.lastName}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${student.email}`}
                        className="text-gray-500 underline-offset-2 transition-colors hover:text-primary-600 hover:underline"
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                        >
                          <Pencil size={14} /> Modifier
                        </button>
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
                      </div>
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
            id="create-fullName"
            label="Nom complet"
            placeholder="Jean Dupont"
            value={createForm.fullName}
            onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
            error={createErrors.fullName}
            autoFocus
          />
          <Input
            id="create-email"
            type="email"
            label="Email"
            placeholder="jean@example.com"
            value={createForm.email}
            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            error={createErrors.email}
          />
          <Input
            id="create-password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            error={createErrors.password}
          />
          <p className="text-xs text-gray-400">Assurez-vous d'entrer les bonnes informations.</p>
          <Button type="submit" variant="violet" loading={isCreating} className="mt-1 w-full bg-gradient-to-r from-primary-600 to-primary-700">
            Créer le compte
          </Button>
        </form>
      </Modal>

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Modifier l'étudiant" icon={Pencil} tone="violet">
        {editTarget && (
          <form onSubmit={handleEdit} className="flex flex-col gap-4" noValidate>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom complet</label>
              <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-navy">
                {editTarget.firstName} {editTarget.lastName}
              </p>
            </div>
            <Input
              id="edit-email"
              type="email"
              label="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              error={editErrors.email}
              autoFocus
            />
            <Input
              id="edit-password"
              type="password"
              label="Nouveau mot de passe (optionnel)"
              placeholder="Laisser vide pour conserver"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              error={editErrors.password}
            />
            <div className="flex justify-end gap-3 mt-1">
              <Button variant="ghost" onClick={() => setEditTarget(null)}>
                Annuler
              </Button>
              <Button type="submit" variant="violet" loading={isEditing} className="bg-gradient-to-r from-primary-600 to-primary-700">
                Enregistrer
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={Boolean(confirmTarget)} onClose={() => setConfirmTarget(null)} title="Désactiver cet étudiant ?" icon={UserX} tone="danger">
        {confirmTarget && (
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
            <Avatar student={confirmTarget} list={students} />
            <div>
              <p className="text-sm font-semibold text-navy">{`${confirmTarget.firstName} ${confirmTarget.lastName}`}</p>
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
