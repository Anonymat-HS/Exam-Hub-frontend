import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const MOCK_EXAM_DATA = {
  id: 1,
  title: 'React Fundamentals',
  questions: [
    {
      id: 101,
      text: 'Quel Hook permet de gérer un état local ?',
      points: 2,
      options: [
        { id: 'a', label: 'A', text: 'useEffect' },
        { id: 'b', label: 'B', text: 'useState' },
        { id: 'c', label: 'C', text: 'useMemo' },
      ],
    },
    {
      id: 102,
      text: "Quelle syntaxe permet d'afficher une variable dans JSX ?",
      points: 1,
      options: [
        { id: 'a', label: 'A', text: '{{ variable }}' },
        { id: 'b', label: 'B', text: '[[ variable ]]' },
        { id: 'c', label: 'C', text: '{variable}' },
      ],
    },
    {
      id: 103,
      text: 'Quel composant React est utilisé pour envelopper les routes dans React Router ?',
      points: 2,
      options: [
        { id: 'a', label: 'A', text: 'BrowserRouter' },
        { id: 'b', label: 'B', text: 'RouteHandler' },
        { id: 'c', label: 'C', text: 'SwitchContainer' },
      ],
    },
    {
      id: 104,
      text: 'Quelle méthode permet de transmettre des données aux composants enfants ?',
      points: 1,
      options: [
        { id: 'a', label: 'A', text: 'les Props' },
        { id: 'b', label: 'B', text: 'les States' },
        { id: 'c', label: 'C', text: 'les Reducers' },
      ],
    },
    {
      id: 105,
      text: 'À quoi sert le hook useEffect ?',
      points: 2,
      options: [
        { id: 'a', label: 'A', text: 'Créer un style CSS en ligne' },
        { id: 'b', label: 'B', text: 'Exécuter des effets secondaires' },
        { id: 'c', label: 'C', text: 'Interdire le re-rendu du composant' },
      ],
    },
  ],
};

export function TakeExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/student/exams/${examId || 1}`, {
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
        setExam(data);
      } catch (error) {
        console.error('Erreur API (fallback données de simulation) :', error.message);
        setExam(MOCK_EXAM_DATA);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam?.questions?.length || 0;

  const handleQuit = () => {
    navigate('/student/exams');
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitModal(false);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/student/exams/${exam?.id || 1}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ answers }),
      });
    } catch (error) {
      console.error('Erreur soumission :', error.message);
    } finally {
      navigate('/student/results');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-indigo-600">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full pb-16">
      
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Examen en cours
          </span>
          <h1 className="mt-0.5 text-2xl sm:text-3xl font-extrabold text-gray-900">
            {exam?.title}
          </h1>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium">Progression</p>
          <p className="text-xl font-black text-gray-900">
            {answeredCount}/{totalQuestions}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-lg mb-8">
        <p className="text-sm font-medium text-indigo-100">
          Répondez aux questions suivantes
        </p>
        <h2 className="text-2xl sm:text-3xl font-black mt-1">
          Prenez votre temps.
        </h2>
      </div>

      <div className="space-y-6">
        {exam?.questions?.map((q, index) => {
          const isAnswered = answers[q.id] !== undefined;

          return (
            <div
              key={q.id}
              className={`rounded-2xl bg-white p-6 shadow-sm border transition-all duration-200 ${
                isAnswered ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                    {q.text}
                  </h3>
                </div>

                <span className="text-xs font-semibold text-gray-400 shrink-0 mt-1">
                  {q.points} pt{q.points > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3">
                {q.options.map((option) => {
                  const isSelected = answers[q.id] === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleOptionSelect(q.id, option.id)}
                      className={`w-full flex items-center gap-4 rounded-xl p-4 text-left transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-400 text-indigo-950 shadow-sm'
                          : 'bg-gray-50/80 hover:bg-gray-100 border-transparent text-gray-800'
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-500 shadow-sm'
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-sm font-semibold">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={handleQuit}
          className="rounded-xl bg-white border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          Quitter
        </button>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
        >
          Soumettre
          <ArrowRight size={16} />
        </button>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 text-left animate-scale-up">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-5">
              <AlertCircle size={24} />
            </div>

            <h3 className="text-xl font-extrabold text-gray-900">
              Soumettre l'examen ?
            </h3>

            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Cette action est définitive. Vous ne pourrez plus modifier vos réponses.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl bg-gray-100 hover:bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all cursor-pointer"
              >
                Retour
              </button>

              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}