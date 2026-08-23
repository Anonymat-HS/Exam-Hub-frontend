import { ArrowRight, FileText, Calendar } from 'lucide-react';

export function ExamCard({ exam, onStart }) {
  const { title, description, questionsCount, dueDate, status } = exam;
  
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
            {status}
          </span>
        </div>

        <span className="mt-6 block text-xs font-bold uppercase tracking-wider text-indigo-600">
          Évaluation
        </span>
        
        <h3 className="mt-1 text-lg font-bold text-gray-900">
          {title}
        </h3>
        
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <FileText size={14} />
            <span>{questionsCount} questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{dueDate}</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98] cursor-pointer"
        >
          Commencer <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
