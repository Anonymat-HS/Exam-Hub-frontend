import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200',
  secondary: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-50',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={16} />}
      {children}
    </button>
  );
}
