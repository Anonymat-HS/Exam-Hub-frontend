import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Users, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { EmptyState } from '../../components/common/EmptyState';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import { courseService } from '../../services/courseService';
import { formatDateTime } from '../../utils/formatters';
import { MOCK_COURSES, MOCK_RESULTS } from '../../data/mockData';

function SkeletonPage() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 h-4 w-40 rounded-full bg-gray-100" />
      <div className="mb-2 h-8 w-64 rounded-full bg-gray-100" />
      <div className="mb-6 h-4 w-48 rounded-full bg-gray-100" />
      <div className="mb-6 grid gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((i) => <div key={i} className="h-28 rounded-2xl bg-gray-100" />)}
      </div>
    </div>
  );
}

export function ExamResultsPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  useEffect(() => {
    Promise.allSettled([
      examService.getExamDetail(examId),
      resultService.getExamResults(examId),
      courseService.getCourses(),
    ]).then(([examRes, resultsRes, coursesRes]) => {
      let usingMock = false;
      if (examRes.status === 'fulfilled') {
        setExam(examRes.value);
      } else {
        setExam(null);
        usingMock = true;
      }
      if (resultsRes.status === 'fulfilled') {
        setResultsData(resultsRes.value);
      } else {
        setResultsData(MOCK_RESULTS);
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
  }, [examId]);

  function getCourseName(courseId) {
    const c = courses.find((c) => c.id === courseId);
    return c ? `${c.code} — ${c.name}` : '—';
  }

  function getMaxScore() {
    return resultsData?.totalPoints ?? exam?.totalPoints ?? null;
  }

  if (isLoading) return <SkeletonPage />;
  if (!exam && !resultsData) {
    return (
      <div>
        <Link to="/admin/exams" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600">
          <ArrowLeft size={16} /> Retour aux examens
        </Link>
        <EmptyState icon={BarChart2} title="Examen introuvable" description="Cet examen n'existe pas ou a été supprimé." />
      </div>
    );
  }

  const maxScore = getMaxScore();
  const results = resultsData?.results ?? [];
  const average = resultsData?.average;
  const totalAttempts = resultsData?.totalAttempts ?? 0;

  return (
    <div>
      <Link
        to="/admin/exams"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-600"
      >
        <ArrowLeft size={16} /> Retour aux examens
      </Link>

      {isUsingMockData && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Données de démonstration affichées — le serveur backend est indisponible.
        </div>
      )}

      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">Résultats</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-navy">{exam?.title ?? 'Examen'}</h1>
        {exam && <p className="mt-1 text-gray-500">{getCourseName(exam.courseId)}</p>}
        {exam && (
          <p className="mt-1 text-sm text-gray-400">
            {formatDateTime(exam.startDate)} → {formatDateTime(exam.endDate)}
          </p>
        )}
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Moyenne"
          value={average != null && maxScore ? `${average.toFixed(1)} / ${maxScore}` : average != null ? average.toFixed(1) : '—'}
        />
        <StatCard
          icon={Users}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          label="Tentatives"
          value={totalAttempts}
        />
        <StatCard
          icon={BarChart2}
          iconBg="bg-primary-50"
          iconColor="text-primary-600"
          label="Étudiants"
          value={results.length}
          sublabel="ayant soumis"
        />
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={BarChart2}
          title="Aucun résultat"
          description="Aucun étudiant n'a encore soumis cet examen."
          bubbleClass="bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Mobile card view */}
          <div className="flex flex-col gap-3 p-4 md:hidden">
            {results.map((r) => (
              <div key={r.studentId} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-gray-100">
                <div>
                  <p className="text-sm font-semibold text-navy">{r.firstName} {r.lastName}</p>
                  <p className="text-xs text-gray-400">{formatDateTime(r.submittedAt)}</p>
                </div>
                <span className="text-sm font-bold tabular-nums text-navy">
                  {r.score}{maxScore ? ` / ${maxScore}` : ''}
                </span>
              </div>
            ))}
          </div>
          {/* Desktop table */}
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="bg-gray-50/60 text-left text-xs uppercase tracking-wider text-gray-400">
                  <th scope="col" className="px-6 py-3 font-medium">Étudiant</th>
                  <th scope="col" className="px-6 py-3 font-medium">Note</th>
                  <th scope="col" className="px-6 py-3 font-medium">Date de soumission</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.studentId} className="border-t border-gray-50 transition-colors hover:bg-gray-50/70">
                    <td className="px-6 py-4">
                      <span className="font-medium text-navy">{r.firstName} {r.lastName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-navy">
                        {r.score}{maxScore ? ` / ${maxScore}` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDateTime(r.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
