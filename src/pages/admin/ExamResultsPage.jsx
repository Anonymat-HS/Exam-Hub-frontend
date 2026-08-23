import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BarChart2, Users, TrendingUp } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';
import { examService } from '../../services/examService';
import { resultService } from '../../services/resultService';
import { courseService } from '../../services/courseService';
import { formatDateTime } from '../../utils/formatters';

const MOCK_COURSES = [
  { id: 'c1', code: 'PROG2', name: 'Programmation Java' },
];

const MOCK_EXAM = {
  id: 'e1', title: 'Examen final Java', courseId: 'c1',
  startDate: '2026-09-15T09:00:00Z', endDate: '2026-09-15T11:00:00Z',
  questions: [
    { id: 'q1', text: 'Q1', points: 1, choices: [] },
    { id: 'q2', text: 'Q2', points: 2, choices: [] },
    { id: 'q3', text: 'Q3', points: 1, choices: [] },
    { id: 'q4', text: 'Q4', points: 2, choices: [] },
    { id: 'q5', text: 'Q5', points: 2, choices: [] },
  ],
};

const MOCK_RESULTS = {
  average: 14.2,
  totalAttempts: 25,
  results: [
    { studentId: 's1', firstName: 'Jean', lastName: 'Dupont', score: 17, submittedAt: '2026-09-15T10:45:00Z' },
    { studentId: 's2', firstName: 'Marie', lastName: 'Martin', score: 12, submittedAt: '2026-09-15T10:50:00Z' },
    { studentId: 's3', firstName: 'Lucas', lastName: 'Bernard', score: 19, submittedAt: '2026-09-15T10:38:00Z' },
    { studentId: 's4', firstName: 'Emma', lastName: 'Petit', score: 8, submittedAt: '2026-09-15T10:55:00Z' },
    { studentId: 's5', firstName: 'Hugo', lastName: 'Moreau', score: 15, submittedAt: '2026-09-15T10:42:00Z' },
    { studentId: 's6', firstName: 'Léa', lastName: 'Roux', score: 11, submittedAt: '2026-09-15T10:58:00Z' },
    { studentId: 's7', firstName: 'Nathan', lastName: 'Garnier', score: 20, submittedAt: '2026-09-15T10:30:00Z' },
    { studentId: 's8', firstName: 'Chloé', lastName: 'Lambert', score: 14, submittedAt: '2026-09-15T10:47:00Z' },
  ],
};

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

function StatCard({ icon: Icon, iconBg, iconColor, label, value, sublabel }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-gray-900">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}

export function ExamResultsPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [resultsData, setResultsData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      examService.getExamDetail(examId),
      resultService.getExamResults(examId),
      courseService.getCourses(),
    ]).then(([examRes, resultsRes, coursesRes]) => {
      if (examRes.status === 'fulfilled') {
        setExam(examRes.value);
      } else {
        setExam({ ...MOCK_EXAM, id: examId });
      }
      if (resultsRes.status === 'fulfilled') {
        setResultsData(resultsRes.value);
      } else {
        setResultsData(MOCK_RESULTS);
      }
      if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)) {
        setCourses(coursesRes.value);
      } else {
        setCourses(MOCK_COURSES);
      }
    }).finally(() => setIsLoading(false));
  }, [examId]);

  function getCourseName(courseId) {
    const c = courses.find((c) => c.id === courseId);
    return c ? `${c.code} — ${c.name}` : '—';
  }

  function getMaxScore() {
    if (!exam?.questions) return null;
    return exam.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  }

  if (isLoading) return <SkeletonPage />;
  if (!exam) return null;

  const maxScore = getMaxScore();
  const results = resultsData?.results ?? [];
  const average = resultsData?.average ?? 0;
  const totalAttempts = resultsData?.totalAttempts ?? 0;

  return (
    <div>
      <Link
        to="/admin/exams"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft size={16} /> Retour aux examens
      </Link>

      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">Résultats</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{exam.title}</h1>
        <p className="mt-1 text-gray-500">{getCourseName(exam.courseId)}</p>
        <p className="mt-1 text-sm text-gray-400">
          {formatDateTime(exam.startDate)} → {formatDateTime(exam.endDate)}
        </p>
      </div>

      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          label="Moyenne"
          value={maxScore ? `${average.toFixed(1)} / ${maxScore}` : average.toFixed(1)}
        />
        <StatCard
          icon={Users}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Tentatives"
          value={totalAttempts}
        />
        <StatCard
          icon={BarChart2}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
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
          bubbleClass="bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-500"
        />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
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
                      <span className="font-medium text-gray-900">{r.firstName} {r.lastName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
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
