import { BarChart2 } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { formatDateTime } from '../../utils/formatters';

export function ResultTable({ results, scoreMax, examTitle }) {
  if (!results || results.length === 0) {
    return (
      <EmptyState
        icon={BarChart2}
        title="Aucune tentative"
        description="Aucun étudiant n'a encore soumis cet examen."
        bubbleClass="bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500"
      />
    );
  }

  const sorted = [...results].sort((a, b) => b.score - a.score);

  return (
    <div>
      {examTitle && <h2 className="p-6 pb-0 text-lg font-bold text-navy">{examTitle}</h2>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              <th scope="col" className="px-6 py-3">ÉTUDIANT</th>
              <th scope="col" className="px-6 py-3">NOTE</th>
              <th scope="col" className="px-6 py-3">DATE</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.studentId} className="border-b border-gray-50 transition-colors hover:bg-gray-50/70 last:border-none">
                <td className="px-6 py-4 font-semibold text-navy">
                  {r.firstName} {r.lastName}
                </td>
                <td className="px-6 py-4 font-semibold text-green-600">
                  {r.score}{scoreMax ? ` / ${scoreMax}` : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDateTime(r.submittedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
