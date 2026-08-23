export function Loader({ label = 'Chargement...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600" role="status" aria-label={label} />
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}
