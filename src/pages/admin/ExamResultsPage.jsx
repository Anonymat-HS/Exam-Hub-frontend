import { useEffect, useState } from 'react';
import { ClipboardCheck, BarChart2, FileText, ChevronDown } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ResultTable } from '../../components/admin/ResultTable';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import { ApiError } from '../../services/api';

function ExamResultsContent({ examId }) {
  const [examDetail, setExamDetail] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState('');

  const isLoading = examDetail === null && resultsData === null && !error;

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      examService.getExamDetail(examId),
      resultService.getExamResults(examId),
    ]).then(([detailRes, resultsRes]) => {
      if (cancelled) return;
      if (detailRes.status === 'fulfilled') {
        setExamDetail(detailRes.value);
      } else {
        setError(detailRes.reason instanceof ApiError ? detailRes.reason.message : 'Erreur de chargement des détails.');
      }
      if (resultsRes.status === 'fulfilled') {
        setResultsData(resultsRes.value);
      } else {
        setError(resultsRes.reason instanceof ApiError ? resultsRes.reason.message : 'Erreur de chargement des résultats.');
      }
    });

    return () => { cancelled = true; };
  }, [examId]);

  const scoreMax = examDetail?.questions?.reduce((sum, q) => sum + (q.points ?? 0), 0) ?? null;
  const questionsCount = examDetail?.questions?.length ?? 0;
  const totalAttempts = resultsData?.totalAttempts ?? 0;
  const average = resultsData?.average ?? 0;
  const results = resultsData?.results ?? [];

  if (isLoading) return <Loader label="Chargement des résultats..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardCheck size={20} />
          </div>
          <p className="text-sm text-gray-500">Tentatives</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalAttempts}</p>
          <p className="mt-1 text-xs text-gray-400">soumissions</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <BarChart2 size={20} />
          </div>
          <p className="text-sm text-gray-500">Moyenne</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {totalAttempts > 0 ? `${average.toFixed(1)}${scoreMax ? ` / ${scoreMax}` : ''}` : '—'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {scoreMax ? `sur ${scoreMax} points` : '\u00A0'}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <FileText size={20} />
          </div>
          <p className="text-sm text-gray-500">Questions</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{questionsCount}</p>
          <p className="mt-1 text-xs text-gray-400">questions</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <ResultTable results={results} scoreMax={scoreMax} examTitle={examDetail?.title ?? ''} />
      </div>
    </>
  );
}

export function ExamResultsPage() {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    examService
      .getExams()
      .then((data) => {
        if (Array.isArray(data)) {
          setExams(data);
          if (data.length > 0) setSelectedExamId(data[0].id);
        }
      })
      .catch((err) => {
        if (err instanceof ApiError) setError(err.message);
        else setError('Erreur de chargement des examens.');
      })
      .finally(() => setIsLoadingExams(false));
  }, []);

  if (isLoadingExams) return <Loader />;

  return (
    <div>
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Administration</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Résultats</h1>
        <p className="mt-1 text-gray-500">Suivez les performances de vos étudiants.</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        </div>
      )}

      {exams.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Aucun examen disponible. Créez un examen d'abord.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <label htmlFor="exam-select" className="mb-2 block text-sm font-medium text-gray-700">Examen</label>
            <div className="relative">
              <select
                id="exam-select"
                value={selectedExamId ?? ''}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>{exam.title}</option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {selectedExamId && <ExamResultsContent key={selectedExamId} examId={selectedExamId} />}
        </>
      )}
    </div>
  );
}
