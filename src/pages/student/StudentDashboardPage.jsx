
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Trophy } from 'lucide-react';
import { Loader } from '../../components/common/Loader';
import { ExamCard } from '../../components/common/ExamCard';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { myExamService } from '../../api/myExamService';
import { myResultService } from '../../api/myResultService';

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const studentName = user?.firstName || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'Étudiant';

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const [examsData, resultsData] = await Promise.all([
          myExamService.getExams('open'),
          myResultService.getResults(),
        ]);
        setExams(examsData);
        setResults(resultsData);
      } catch (err) {
        setError(err.message || 'Une erreur est survenue lors du chargement des données.');
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
    <div className="animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
        Bonjour {studentName} 
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
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => { setError(null); setIsLoading(true); }} />
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
