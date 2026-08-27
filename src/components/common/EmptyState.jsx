export function EmptyState({ message = 'Aucune donnée disponible.' }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center text-gray-500 shadow-sm border border-gray-100">
      {message}
    </div>
  );
}
