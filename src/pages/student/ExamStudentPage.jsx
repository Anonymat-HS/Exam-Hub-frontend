import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ExamCard } from '../../components/common/ExamCard';
import { ExamCardSkeleton } from '../../components/student/ExamCardSkeleton';
import { myExamService } from '../../api/myExamService';

export function ExamStudentPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await myExamService.getExams('open');
        setExams(data);
      } catch {
        setExams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleStartExam = (id) => {
    navigate(`/student/exams/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up">
      <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
        Espace Étudiant
      </span>
      
      <h1 className="mt-1 text-3xl font-extrabold text-gray-900">
        Examens disponibles
      </h1>
      
      <p className="mt-1 text-sm text-gray-500">
        Les examens actuellement ouverts pour vous.
      </p>

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
      ) : exams.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
          Aucun examen disponible pour le moment.
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
