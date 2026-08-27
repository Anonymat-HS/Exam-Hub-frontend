
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Trophy, Loader2 } from 'lucide-react';
import { ExamCard } from '../../components/common/ExamCard';
import { useAuth } from '../../hooks/useAuth';
import { myExamService } from '../../api/myExamService';
import { myResultService } from '../../api/myResultService';

const MOCK_EXAMS = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Composants, hooks et gestion de l\'état avec React.',
    questionCount: 2,
    endDate: '2026-12-31T23:59:00',
  },
  {
    id: 2,
    title: 'SQL & PostgreSQL',
    description: 'Évaluation SQL et conception de bases relationnelles.',
    questionCount: 2,
    endDate: '2026-12-31T23:59:00',
  },
];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentName = user?.name || user?.email || 'Étudiant';

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, resultsData] = await Promise.all([
          myExamService.getExams('open'),
          myResultService.getResults(),
        ]);
        setExams(examsData);
        setResults(resultsData);
      } catch (error) {
        console.error('Erreur API (fallback données de simulation) :', error.message);
        setExams(MOCK_EXAMS);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigateToExams = () => {
    navigate('/student/exams');
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
        Bonjour {studentName} 👋
      </span>
      
      <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
        Votre espace
      </h1>
      
      <p className="mt-1 text-sm text-gray-500">
        Retrouvez vos examens et vos résultats.
      </p>

      <div className="mt-8 rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 sm:p-8 text-white shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary-200">
          Votre prochaine étape
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold">Un examen vous attend.</h2>
        <p className="mt-2 text-sm text-primary-100">
          Consultez vos examens disponibles et commencez lorsque vous êtes prêt.
        </p>

        <button 
          onClick={handleNavigateToExams}
          className="mt-6 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-600 shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          Commencer maintenant <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <FileText size={20} />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-400">Disponibles</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{exams.length}</p>
          <p className="text-xs text-gray-400">examen{exams.length > 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle size={20} />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-400">Terminés</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{results.length}</p>
          <p className="text-xs text-gray-400">examen{results.length > 1 ? 's' : ''} passé{results.length > 1 ? 's' : ''}</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <Trophy size={20} />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-400">Résultats</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{results.length}</p>
          <p className="text-xs text-gray-400">note{results.length > 1 ? 's' : ''} disponible{results.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Examens disponibles</h2>
          <p className="text-sm text-gray-500 mt-0.5">Commencez quand vous êtes prêt.</p>
        </div>

        <button 
          onClick={handleNavigateToExams}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
        >
          Tout voir
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-primary-600">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {exams.slice(0, 2).map((exam) => (
            <ExamCard 
              key={exam.id} 
              exam={exam} 
              onStart={() => navigate(`/student/exams/${exam.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
