
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Trophy } from 'lucide-react';
import { ExamCard } from '../../components/common/ExamCard';

const useAuth = () => {
  throw new Error("Pas de contexte");
};

const MOCK_EXAMS = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Composants, hooks et gestion de l\'état avec React.',
    questionsCount: 2,
    dueDate: '31/12/2026 23:59',
    status: 'Disponible'
  },
  {
    id: 2,
    title: 'SQL & PostgreSQL',
    description: 'Évaluation SQL et conception de bases relationnelles.',
    questionsCount: 2,
    dueDate: '31/12/2026 23:59',
    status: 'Disponible'
  }
];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  let user;

  try {
    const auth = useAuth();
    user = auth?.user;
  } catch {
    user = { name: 'Alice Martin' };
  }

  const studentName = user?.name || 'Alice';


  const handleNavigateToExams = () => {
    navigate('/student/exams');
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
        Bonjour {studentName} 👋
      </span>
      
      <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
        Votre espace
      </h1>
      
      <p className="mt-1 text-sm text-gray-500">
        Retrouvez vos examens et vos résultats.
      </p>

      <div className="mt-8 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-sm">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
          Votre prochaine étape
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold">Un examen vous attend.</h2>
        <p className="mt-2 text-sm text-indigo-100">
          Consultez vos examens disponibles et commencez lorsque vous êtes prêt.
        </p>

        <button 
          onClick={handleNavigateToExams}
          className="mt-6 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          Commencer maintenant <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-400">Disponibles</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">2</p>
          <p className="text-xs text-gray-400">examens</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle size={20} />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-400">Terminés</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-400">examens passés</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Trophy size={20} />
          </div>
          <p className="mt-4 text-xs font-medium text-gray-400">Résultats</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-400">notes disponibles</p>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Examens disponibles</h2>
          <p className="text-sm text-gray-500 mt-0.5">Commencez quand vous êtes prêt.</p>
        </div>

        <button 
          onClick={handleNavigateToExams}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          Tout voir
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {MOCK_EXAMS.map((exam) => (
          <ExamCard 
            key={exam.id} 
            exam={exam} 
            onStart={() => console.log(`Examen ${exam.id}`)} 
          />
        ))}
      </div>
    </div>
  );
}
