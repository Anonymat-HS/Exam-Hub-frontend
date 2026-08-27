import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message, className = '' }) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 ${className}`}>
      <AlertCircle size={18} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
