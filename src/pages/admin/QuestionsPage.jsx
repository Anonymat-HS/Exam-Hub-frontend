import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Lock, FileText } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { EmptyState } from '../../components/common/EmptyState';
import { QuestionForm } from '../../components/admin/QuestionForm';
import { examService } from '../../api/examService';
import { questionService } from '../../api/questionService';
import { resultService } from '../../api/resultService';
import { courseService } from '../../api/courseService';
import { ApiError } from '../../api/api';
import { formatDateTime } from '../../utils/formatters';


function SkeletonPage() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-4 w-40 rounded-full bg-gray-100" />
      <div className="mb-2 h-8 w-64 rounded-full bg-gray-100" />
      <div className="mb-6 h-4 w-48 rounded-full bg-gray-100" />
      <div className="flex flex-col gap-4 sm:flex-row">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 flex-1 rounded-2xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export function QuestionsPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const [addTarget, setAddTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      examService.getExamDetail(examId),
      questionService.getQuestions(examId),
      resultService.getExamResults(examId),
      courseService.getCourses(),
    ]).then(([examData, questionsData, resultsData, coursesData]) => {
      setExam(examData);
      if (Array.isArray(questionsData)) setQuestions(questionsData);
      if (resultsData) setIsLocked((resultsData.totalAttempts ?? 0) > 0);
      if (Array.isArray(coursesData)) setCourses(coursesData);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, [examId]);

  function getCourseName(courseId) {
    const c = courses.find((c) => c.id === courseId);
    return c ? `${c.code} — ${c.name}` : '—';
  }

  async function handleAdd(payload) {
    setActionError('');
    setIsSubmitting(true);
    try {
      const created = await questionService.createQuestion(examId, payload);
      setQuestions((prev) => [...prev, created]);
      setAddTarget(null);
    } catch {
      setActionError('Erreur lors de la création.');
    }
  }

  async function handleEdit(payload) {
    if (!editTarget) return;
    setActionError('');
    setIsSubmitting(true);
    try {
      const updated = await questionService.updateQuestion(editTarget.id, payload);
      setQuestions((prev) => prev.map((q) => (q.id === editTarget.id ? updated : q)));
      setEditTarget(null);
    } catch {
      setQuestions((prev) => prev.map((q) => (q.id === editTarget.id ? { ...q, ...payload } : q)));
      setEditTarget(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setActionError('');
    setIsSubmitting(true);
    try {
      await questionService.deleteQuestion(deleteTarget.id);
      setQuestions((prev) => prev.filter((q) => q.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setActionError(err.message);
      } else {
        setActionError('Erreur lors de la suppression.');
      }
      setDeleteTarget(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return <SkeletonPage />;
  if (!exam) {
    return (
      <div>
        <Link to="/admin/exams" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600">
          <ArrowLeft size={16} /> Retour aux examens
        </Link>
        <EmptyState icon={FileText} title="Examen introuvable" description="Cet examen n'existe pas ou a été supprimé." />
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/admin/exams"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600"
      >
        <ArrowLeft size={16} /> Retour aux examens
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">{exam.title}</h1>
        <p className="mt-1 text-gray-500">{getCourseName(exam.courseId)}</p>
        <p className="mt-1 text-sm text-gray-400">
          {formatDateTime(exam.startDate)} → {formatDateTime(exam.endDate)}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {questions.length} question{questions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isLocked && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Lock size={18} className="shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Examen verrouillé</p>
            <p className="text-xs text-amber-600">
              Cet examen possède déjà des tentatives. Les questions et les choix ne peuvent plus être modifiés ou supprimés.
            </p>
          </div>
        </div>
      )}

      {!isLocked && (
        <div className="mb-6">
          <Button
            variant="violet"
            onClick={() => setAddTarget(true)}
            className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-md shadow-primary-200 transition-transform hover:-translate-y-0.5"
          >
            <Plus size={16} /> Ajouter une question
          </Button>
        </div>
      )}

      {actionError && <div className="mb-4"><ErrorMessage message={actionError} onRetry={() => setActionError('')} /></div>}

      {questions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune question"
          description={isLocked ? 'Cet examen ne contient aucune question.' : 'Ajoutez votre première question avec le bouton ci-dessus.'}
          bubbleClass="bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Question {idx + 1}</p>
                {!isLocked && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditTarget(q)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                      title="Modifier"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(q)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="mb-2 text-sm font-medium text-navy">{q.text}</p>
              <p className="mb-3 text-xs text-gray-400">{q.points} point{q.points !== 1 ? 's' : ''}</p>
              <div className="flex flex-col gap-1.5">
                {(q.choices ?? []).map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={`text-sm ${c.isCorrect ? 'font-medium text-green-700' : 'text-gray-600'}`}>
                      {c.text}
                    </span>
                    {c.isCorrect && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">Correct</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={Boolean(addTarget)} onClose={() => setAddTarget(null)} title="Ajouter une question" icon={Plus}>
        <QuestionForm onSubmit={handleAdd} onCancel={() => setAddTarget(null)} loading={isSubmitting} />
      </Modal>

      <Modal open={Boolean(editTarget)} onClose={() => setEditTarget(null)} title="Modifier la question" icon={Pencil}>
        {editTarget && (
          <QuestionForm key={editTarget.id} question={editTarget} onSubmit={handleEdit} onCancel={() => setEditTarget(null)} loading={isSubmitting} />
        )}
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Supprimer cette question ?" icon={Trash2} tone="danger">
        {deleteTarget && (
          <>
            <p className="mb-4 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{deleteTarget.text}</span>
              <br />Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Annuler</Button>
              <Button variant="danger" loading={isSubmitting} onClick={handleDelete}>Supprimer</Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
