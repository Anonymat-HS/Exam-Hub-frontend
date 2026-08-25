import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronRight, Loader2 } from 'lucide-react';

const MOCK_RESULTS = [
  {
    id: 1,
    examTitle: 'React Fundamentals',
    submittedAt: '2026-08-22T18:18:00',
    score: 6.7,
    maxScore: 20,
  },
  {
    id: 2,
    examTitle: 'JavaScript avancé',
    submittedAt: '2026-08-15T14:30:00',
    score: 12.0,
    maxScore: 20,
  },
];

export function StudentResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/student/results', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur réseau HTTP : ${response.status}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Erreur API (passage aux données locales) :', error.message);
        setResults(MOCK_RESULTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleCorrectionClick = (examId) => {
    navigate(`/student/results/${examId}/correction`);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getScoreColorClass = (score, maxScore = 20) => {
    return (score / maxScore) * 100 >= 50 ? 'text-emerald-600' : 'text-red-500';
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
        Espace Étudiant
      </span>

      <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
        Mes résultats
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Retrouvez toutes vos notes.
      </p>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-indigo-600">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
            Aucun résultat disponible pour le moment.
          </div>
        ) : (
          results.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100/80 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform duration-200">
                  <Trophy size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {item.examTitle}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(item.submittedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                <span className={`text-base font-extrabold ${getScoreColorClass(item.score, item.maxScore)}`}>
                  {item.score.toFixed(1)}/{item.maxScore}
                </span>

                <button
                  type="button"
                  onClick={() => handleCorrectionClick(item.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Correction
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}