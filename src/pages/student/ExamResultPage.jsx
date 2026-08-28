import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, XCircle, CheckCircle } from 'lucide-react';
import { ExamResultSkeleton } from '../../components/student/ExamResultSkeleton';
import { myExamService } from '../../api/myExamService';

const MOCK_RESULT_DATA = {
  examTitle: 'React Fundamentals',
  score: 10,
  maxScore: 20,
  submittedAt: '2026-08-22T18:18:00',
  corrections: [
    {
      questionId: 101,
      questionText: 'Quel Hook permet de gérer un état local ?',
      isCorrect: false,
      chosenChoiceId: 'c',
      correctChoiceId: 'b',
      pointsEarned: 0,
      pointsPossible: 1,
    },
    {
      questionId: 102,
      questionText: "Quelle syntaxe permet d'afficher une variable dans JSX ?",
      isCorrect: true,
      chosenChoiceId: 'c',
      correctChoiceId: 'c',
      pointsEarned: 1,
      pointsPossible: 1,
    },
  ],
};

export function ExamResultPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await myExamService.getExamResult(examId);
        setResult(data);
      } catch (error) {
        console.error('Erreur API (données de simulation utilisées) :', error.message);
        setResult(MOCK_RESULT_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResult();
  }, [examId]);

  const handleBack = () => {
    navigate('/student/results');
  };

  if (isLoading) {
    return <ExamResultSkeleton />;
  }

  const isValidated = (result?.score ?? 0) >= (result?.maxScore ?? result?.corrections?.reduce((s, c) => s + c.pointsPossible, 0) ?? 20) / 2;

  return (
    <div className="max-w-5xl mx-auto w-full pb-16">
      
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
            Correction
          </span>
          <h1 className="mt-0.5 text-3xl font-extrabold text-gray-900">
            Votre résultat
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1">
            {result?.examTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          Retour
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        
        <div
          className={`lg:col-span-5 rounded-3xl p-8 text-white shadow-sm flex flex-col justify-between transition-colors duration-300 ${
            isValidated ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          <span className="text-sm font-medium text-white/90">Note finale</span>
          
          <div className="my-6">
            <span className="text-6xl font-black tracking-tight">
              {result?.score ?? 0}
            </span>
            <span className="text-2xl font-bold text-white/80">/{result?.maxScore ?? 20}</span>
          </div>

          <div className="flex items-center gap-2 font-bold text-sm text-white/95">
            {isValidated ? (
              <>
                <CheckCircle size={20} />
                <span>Examen validé</span>
              </>
            ) : (
              <>
                <XCircle size={20} />
                <span>Examen non validé</span>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 rounded-3xl bg-white p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-50/80 p-5 border border-gray-100/50">
              <p className="text-xs font-semibold text-gray-400">Points obtenus</p>
              <p className="mt-2 text-2xl font-black text-gray-900">
                {result?.corrections?.reduce((sum, c) => sum + (c.pointsEarned || 0), 0) ?? 0}/{result?.maxScore ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50/80 p-5 border border-gray-100/50">
              <p className="text-xs font-semibold text-gray-400">Questions</p>
              <p className="mt-2 text-2xl font-black text-gray-900">
                {result?.corrections?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Correction détaillée</h2>

        <div className="space-y-4">
          {result?.corrections?.map((q, index) => {
            const isCorrect = q.isCorrect;

            return (
              <div
                key={q.questionId || index}
                className="rounded-3xl bg-white p-6 sm:p-8 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-6">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      QUESTION {index + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-0.5">
                      {q.questionText}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`rounded-2xl p-4 border transition-colors ${
                      isCorrect
                        ? 'bg-emerald-50/60 border-emerald-100 text-emerald-950'
                        : 'bg-red-50/60 border-red-100 text-red-950'
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-400">Votre réponse</p>
                    <p className="mt-1 text-sm font-semibold">{q.chosenChoiceId ? `Choix ${q.chosenChoiceId}` : 'Pas de réponse'}</p>
                  </div>

                  <div className="rounded-2xl bg-primary-50/50 border border-primary-100/60 p-4 text-primary-900">
                    <p className="text-xs font-medium text-primary-500">Bonne réponse</p>
                    <p className="mt-1 text-sm font-semibold">Choix {q.correctChoiceId}</p>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-400">
                  {q.pointsEarned}/{q.pointsPossible} point{q.pointsPossible > 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
