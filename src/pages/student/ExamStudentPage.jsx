import { ExamCard } from '../../components/common/ExamCard';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_EXAMS = [
  {
    id: 1,
    category: 'WEB2',
    title: 'React Fundamentals',
    description: 'Composants, hooks et gestion de l\'état avec React.',
    questionsCount: 2,
    dueDate: '31/12/2026 23:59',
    status: 'Disponible'
  },
  {
    id: 2,
    category: 'BDD2',
    title: 'SQL & PostgreSQL',
    description: 'Évaluation SQL et conception de bases relationnelles.',
    questionsCount: 2,
    dueDate: '31/12/2026 23:59',
    status: 'Disponible'
  }
];

export function ExamStudentPage() {
  const navigate = useNavigate();

  const handleStartExam = (id) => {
    navigate(`/student/exams/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
        Espace Étudiant
      </span>
      
      <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
        Examens disponibles
      </h1>
      
      <p className="mt-1 text-sm text-gray-500">
        Les examens actuellement ouverts pour vous.
      </p>


      <div className="mt-6 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm animate-pulse">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Donnez le meilleur de vous-même !</h2>
            <p className="mt-1 text-sm text-indigo-100 max-w-xl">
              Chaque évaluation est une opportunité de valider vos compétences et de progresser. Prenez votre temps, lisez bien les consignes et concentrez-vous. Bonne chance !
            </p>
          </div>
        </div>
      </div>


      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {ALL_EXAMS.map((exam) => (
          <ExamCard 
            key={exam.id} 
            exam={exam} 
            onStart={() => handleStartExam(exam.id)} 
          />
        ))}
      </div>
    </div>
  );
}
