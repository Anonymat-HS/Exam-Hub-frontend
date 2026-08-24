import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Pencil, Trash2, BarChart2, ListChecks, X } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { ExamForm } from '../../components/admin/ExamForm';
import { examService } from '../../services/examService';
import { courseService } from '../../services/courseService';
import { ApiError } from '../../services/api';
import { formatDateTime } from '../../utils/formatters';

const MOCK_COURSES = [
  { id: 'c1', code: 'PROG2', name: 'Programmation Java', description: 'Langage Java et conceptsorientés objet' },
  { id: 'c2', code: 'WEB2', name: 'Développement Web 2', description: 'React, routing et SPA' },
  { id: 'c3', code: 'BD2', name: 'Bases de données 2', description: 'SQL avancé et modélisation' },
];

const MOCK_EXAMS = [
  { id: 'e1', title: 'Examen final Java', courseId: 'c1', startDate: '2026-09-15T09:00:00Z', endDate: '2026-09-15T11:00:00Z', description: 'Évaluation complète de Java et POO' },
  { id: 'e2', title: 'Examen partiel Web', courseId: 'c2', startDate: '2026-08-20T14:00:00Z', endDate: '2026-08-20T16:00:00Z', description: 'React, hooks et routing' },
  { id: 'e3', title: 'Quiz bases SQL', courseId: 'c3', startDate: '2026-10-01T10:00:00Z', endDate: '2026-10-01T10:30:00Z', description: 'Requêtes SELECT et JOIN' },
  { id: 'e4', title: 'TP NOTÉ Spring Boot', courseId: 'c1', startDate: '2026-07-10T08:00:00Z', endDate: '2026-07-10T12:00:00Z', description: 'Création d\'une API REST' },
];

function getExamStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return { label: 'À venir', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-500' };
  if (now <= end) return { label: 'Ouvert', color: 'bg-green-50 text-green-600', dot: 'bg-green-500' };
  return { label: 'Terminé', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' };
}

function SkeletonRows() {
  return (
    <div className="flex flex-col gap-5 p-6" role="status" aria-label="Chargement des examens">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex animate-pulse items-center gap-4">
          <span className="h-4 w-48 rounded-full bg-gray-100" />
          <span className="h-4 w-24 rounded-full bg-gray-100" />
          <span className="h-4 w-32 rounded-full bg-gray-100" />
          <span className="ml-auto h-6 w-20 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function ExamsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [actionError, setActionError] = useState('');
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [editTarget, setEditTarget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      examService.getExams(courseFilter || undefined),
      courseService.getCourses(),
    ]).then(([examsRes, coursesRes]) => {
      let usingMock = false;
      if (examsRes.status === 'fulfilled' && Array.isArray(examsRes.value)) {
        setExams(examsRes.value);
      } else {
        setExams(MOCK_EXAMS);
        usingMock = true;
      }
      if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)) {
        setCourses(coursesRes.value);
      } else {
        setCourses(MOCK_COURSES);
        usingMock = true;
      }
      setIsUsingMockData(usingMock);
    }).finally(() => setIsLoading(false));
  }, [courseFilter]);

  function getCourseName(courseId) {
    const c = courses.find((c) => c.id === courseId);
    return c ? `${c.code} — ${c.name}` : '—';
  }

  function getCourseCode(courseId) {
    const c = courses.find((c) => c.id === courseId);
    return c ? c.code : '—';
  }

  const query = search.trim().toLowerCase();
  const filtered = exams.filter((e) => {
    const matchesSearch = !query || e.title.toLowerCase().includes(query) || getCourseCode(e.courseId).toLowerCase().includes(query);
    const matchesCourse = !courseFilter || e.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

  async function handleCreate(payload) {
    setActionError('');
    setIsCreating(true);
    try {
      const created = await examService.createExam(payload);
      setExams((prev) => [created, ...prev]);
      setIsCreateOpen(false);
    } catch {
      const mockCreated = { id: `mock-${Date.now()}`, ...payload };
      setExams((prev) => [mockCreated, ...prev]);
      setIsCreateOpen(false);
    }
  }

  async function handleEdit(payload) {
    if (!editTarget) return;
    setActionError('');
    setIsEditing(true);
    try {
      const updated = await examService.updateExam(editTarget.id, payload);
      setExams((prev) => prev.map((e) => (e.id === editTarget.id ? updated : e)));
      setEditTarget(null);
    } catch {
      setExams((prev) => prev.map((e) => (e.id === editTarget.id ? { ...e, ...payload } : e)));
      setEditTarget(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionError('');
    setIsDeleting(true);
    try {
      await examService.deleteExam(deleteTarget.id);
      setExams((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError('Erreur lors de la suppression.');
      }
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Administration</p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Examens</h1>
          <p className="mt-1 text-gray-500">Gérez les examens, leurs périodes de disponibilité et leurs questions.</p>
        </div>
        <Button
          variant="violet"
          onClick={() => setIsCreateOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 shadow-md shadow-violet-200 transition-transform hover:-translate-y-0.5"
        >
          <Plus size={16} /> Nouvel examen
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
              aria-label="Rechercher un examen par titre"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-[30px] -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Tous les cours</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.code}</option>
              ))}
            </select>
          </div>

          <span className="ml-auto rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            {filtered.length === 0 ? '0 examen' : filtered.length === 1 ? '1 examen' : `${filtered.length} examens`}
          </span>
        </div>

        {actionError && <ErrorMessage message={actionError} onRetry={() => setActionError('')} />}

        {isLoading ? (
          <SkeletonRows />
        ) : filtered.length === 0 ? (
          exams.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Aucun examen"
              description="Créez votre premier examen avec le bouton « Nouvel examen »."
              bubbleClass="bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-500"
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Aucun résultat"
              description="Aucun examen ne correspond à votre recherche."
            />
          )
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/60 text-left text-xs uppercase tracking-wider text-gray-400">
                  <th scope="col" className="px-6 py-3 font-medium">Examen</th>
                  <th scope="col" className="px-6 py-3 font-medium">Cours</th>
                  <th scope="col" className="px-6 py-3 font-medium">Disponibilité</th>
                  <th scope="col" className="px-6 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam) => {
                  const status = getExamStatus(exam.startDate, exam.endDate);
                  return (
                    <tr key={exam.id} className="border-t border-gray-50 transition-colors hover:bg-gray-50/70">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{exam.title}</p>
                        {exam.description && (
                          <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">{exam.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-gray-50 px-2 py-1 font-mono text-xs text-gray-500">
                          {getCourseCode(exam.courseId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <p>{formatDateTime(exam.startDate)}</p>
                        <p className="text-gray-400">→ {formatDateTime(exam.endDate)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/admin/exams/${exam.id}/questions`)}
                            title="Questions"
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <ListChecks size={14} />
                          </button>
                          <button
                            onClick={() => setEditTarget(exam)}
                            title="Modifier"
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/exams/${exam.id}/results`)}
                            title="Résultats"
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                          >
                            <BarChart2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(exam)}
                            title="Supprimer"
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nouvel examen" icon={FileText}>
        <ExamForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} loading={isCreating} />
      </Modal>

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Modifier l'examen" icon={Pencil}>
        {editTarget && (
          <ExamForm key={editTarget.id} initial={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} loading={isEditing} />
        )}
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Supprimer cet examen ?" icon={Trash2} tone="danger">
        {deleteTarget && (
          <>
            <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3">
              <p className="font-medium text-gray-900">{deleteTarget.title}</p>
              <p className="mt-0.5 text-xs text-gray-400">{getCourseName(deleteTarget.courseId)}</p>
            </div>
            <p className="text-sm text-gray-500">Cette action est irréversible. L&apos;examen et toutes ses questions seront supprimés.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Annuler</Button>
              <Button variant="danger" loading={isDeleting} onClick={handleDelete}>Supprimer</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
