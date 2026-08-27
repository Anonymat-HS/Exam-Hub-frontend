const colorMap = {
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-red-50 text-red-500',
  blue: 'bg-blue-50 text-blue-600',
  gray: 'bg-gray-100 text-gray-600',
  amber: 'bg-amber-50 text-amber-600',
};

export function Badge({ children, color = 'green', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${colorMap[color]} ${className}`}>
      {children}
    </span>
  );
}
