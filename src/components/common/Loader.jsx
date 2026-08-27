import { Loader2 } from 'lucide-react';

export function Loader({ size = 36, className = '' }) {
  return (
    <div className={`flex h-64 items-center justify-center text-indigo-600 ${className}`}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
}
