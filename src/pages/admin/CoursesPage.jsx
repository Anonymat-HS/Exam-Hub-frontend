import { useEffect, useState } from 'react';
import { BookOpen, FileText, Plus } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Modal } from '../../components/common/Modal';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { courseService } from '../../services/courseService';
import { examService } from '../../services/examService';
import { ApiError } from '../../services/api';
import { MOCK_COURSES } from '../../data/mockData';

const EMPTY_FORM = { code: '', name: '', description: '' };

function SkeletonCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="status" aria-label="Chargement des cours">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100/60">
          <span className="mb-6 block h-10 w-10 rounded-xl bg-gray-100" />
          <span className="mb-2 block h-3 w-16 rounded-full bg-gray-100" />
          <span className="mb-4 block h-5 w-48 rounded-full bg-gray-100" />
          <span className="block h-3 w-full rounded-full bg-gray-100" />
          <span className="mt-2 block h-3 w-3/4 rounded-full bg-gray-100" />
          <span className="mt-8 block h-8 w-full rounded-lg bg-gray-50" />
        </div>
      ))}
    </div>
  );
}

export function CoursesPage() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAddedId, setLastAddedId] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    let ignore = false;
    Promise.all([courseService.getCourses(), examService.getExams()])
      .then(([coursesData, examsData]) => {
        if (ignore) return;
        const counts = {};
        if (Array.isArray(examsData)) {
          for (const exam of examsData) {
            counts[exam.courseId] = (counts[exam.courseId] ?? 0) + 1;
          }
        }
        if (Array.isArray(coursesData)) {
          setCourses(coursesData.map((course) => ({ ...course, examCount: counts[course.id] ?? 0 })));
        }
      })
      .catch((err) => {
        if (!ignore) {
          if (err instanceof ApiError) setLoadError('Impossible de charger les cours.');
          setIsUsingMockData(true);
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  function openAddModal() {
    setForm(EMPTY_FORM);
    setErrors({});
    setIsSubmitting(false);
    setIsAddOpen(true);
  }

  function handleRetry() {
    setLoadError('');
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  }

  function validateForm() {
    const next = {};
    const code = form.code.trim().toUpperCase();
    if (!code) next.code = 'Le code est obligatoire.';
    else if (courses.some((c) => c.code.toUpperCase() === code)) next.code = 'Ce code cours est déjà utilisé.';
    if (!form.name.trim()) next.name = 'Le nom du cours est obligatoire.';
    if (!form.description.trim()) next.description = 'La description est obligatoire.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const payload = { code: form.code.trim().toUpperCase(), name: form.name.trim(), description: form.description.trim() };
    try {
      const created = await courseService.createCourse(payload);
      setCourses((prev) => [{ ...created, examCount: 0 }, ...prev]);
      setLastAddedId(created?.id ?? null);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({ code: err.status === 409 ? 'Ce code cours est déjà utilisé.' : err.message });
        setIsSubmitting(false);
        return;
      }
      const demoId = `${Date.now()}`;
      setCourses((prev) => [{ id: demoId, ...payload, examCount: 0 }, ...prev]);
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
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">Administration</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">Cours</h1>
          <p className="mt-1 text-gray-500">Organisez les matières disponibles.</p>
        </div>
        <Button
          variant="violet"
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-md shadow-primary-200 transition-transform hover:-translate-y-0.5"
        >
          <Plus size={16} /> Nouveau cours
        </Button>
      </div>

      {!isLoading && loadError && (
        <div className="mt-6">
          <ErrorMessage message={loadError} onRetry={handleRetry} />
        </div>
      )}

      {isUsingMockData && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Données de démonstration affichées — le serveur backend est indisponible.
        </div>
      )}

      {isLoading ? (
        <SkeletonCards />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Aucun cours"
          description="Commencez par créer votre premier cours."
          bubbleClass="bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500"
        >
          <Button variant="violet" onClick={openAddModal} className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-md shadow-primary-200 transition-transform hover:-translate-y-0.5">
            <Plus size={16} /> Nouveau cours
          </Button>
        </EmptyState>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((course, index) => (
            <div key={course.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
              <article
                className={`flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary-200 ${
                  course.id === lastAddedId ? 'row-highlight' : ''
                }`}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shadow-sm ring-1 ring-primary-100">
                  <BookOpen size={18} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary-600">{course.code}</p>
                <h3 className="mt-1 text-lg font-bold text-navy">{course.name}</h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">{course.description}</p>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
                    <FileText size={13} /> Examens
                  </span>
                  <span className="text-sm font-bold tabular-nums text-navy">{course.examCount ?? 0}</span>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      <Modal open={isAddOpen} onClose={() => setIsAddOpen(false)} title="Nouveau cours" icon={BookOpen} tone="violet">
        <form onSubmit={handleCreate} className="flex flex-col gap-4" noValidate>
          <Input
            id="code"
            label="Code"
            placeholder="PROG3"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            error={errors.code}
            style={{ textTransform: 'uppercase' }}
            autoFocus
          />
          <Input
            id="name"
            label="Nom du cours"
            placeholder="Programmation"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
          />
          <Textarea
            id="description"
            label="Description"
            placeholder="Description du cours..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={errors.description}
          />
          <Button type="submit" variant="violet" loading={isSubmitting} className="w-full bg-gradient-to-r from-primary-600 to-primary-700">
            Créer le cours
          </Button>
        </form>
      </Modal>
    </div>
  );
}
