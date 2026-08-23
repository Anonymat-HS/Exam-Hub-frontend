import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
      <AlertCircle size={18} className="shrink-0" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg px-3 py-1 font-semibold transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
