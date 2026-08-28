import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ExamCard } from '../../components/common/ExamCard';
import { ExamCardSkeleton } from '../../components/student/ExamCardSkeleton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { myExamService } from '../../api/myExamService';

export function ExamStudentPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('open');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const data = await myExamService.getExams(status);
        setExams(data);
      } catch (err) {
        setError(err.message || 'Une erreur est survenue lors du chargement des examens.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [status]);

  const handleStartExam = (id) => {
    navigate(`/student/exams/${id}`);
  };

  const TABS = [
    { value: 'open', label: 'Ouverts' },
    { value: 'upcoming', label: 'À venir' },
  ];

  return (
    <div className="animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
        Espace Étudiant
      </span>
      
      <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
        Examens disponibles
      </h1>
      
      <p className="mt-1 text-sm text-gray-500">
        {status === 'open'
          ? 'Les examens actuellement ouverts pour vous.'
          : 'Les examens à venir, accessibles à leur date de début.'}
      </p>

      <div className="mt-6 inline-flex rounded-xl bg-gray-100 p-1">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatus(value)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 ${
              status === value ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm animate-pulse">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Donnez le meilleur de vous-même !</h2>
            <p className="mt-1 text-sm text-primary-100 max-w-xl">
              Chaque évaluation est une opportunité de valider vos compétences et de progresser. Prenez votre temps, lisez bien les consignes et concentrez-vous. Bonne chance !
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <ExamCardSkeleton />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => { setError(null); setIsLoading(true); }} />
      ) : exams.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
          {status === 'open'
            ? 'Aucun examen ouvert pour le moment.'
            : 'Aucun examen à venir.'}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {exams.map((exam) => (
            <ExamCard 
              key={exam.id} 
              exam={exam} 
              onStart={() => handleStartExam(exam.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
