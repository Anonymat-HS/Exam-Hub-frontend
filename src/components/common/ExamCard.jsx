import { ArrowRight, FileText, Calendar } from 'lucide-react';
import { Badge } from './Badge';
import { formatDateTime } from '../../utils/formatters';

export function ExamCard({ exam, onStart }) {
  const { title, description, questionCount, questionsCount, startDate, endDate } = exam;
  const count = questionCount || questionsCount || 0;

  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  let status = 'Disponible';
  let statusColor = 'green';
  const isUpcoming = Boolean(start && now < start);
  const isClosed = Boolean(end && now > end);
  if (isUpcoming) {
    status = 'À venir';
    statusColor = 'primary';
  } else if (isClosed) {
    status = 'Fermé';
    statusColor = 'gray';
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <FileText size={20} />
          </div>
          <Badge color={statusColor}>{status}</Badge>
        </div>

        <h3 className="mt-6 text-lg font-bold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <FileText size={14} />
            <span>{count} questions</span>
          </div>
          {(startDate || endDate) && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {isUpcoming && startDate
                  ? `Ouvre le ${formatDateTime(startDate)}`
                  : endDate
                    ? formatDateTime(endDate)
                    : formatDateTime(startDate)}
              </span>
            </div>
          )}
        </div>

        {onStart && (
          <button
            onClick={isUpcoming ? undefined : onStart}
            disabled={isUpcoming}
            title={isUpcoming ? 'Cet examen ouvrira à la date indiquée' : undefined}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold shadow-sm transition-all ${
              isUpcoming
                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] cursor-pointer'
            }`}
          >
            Commencer <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
