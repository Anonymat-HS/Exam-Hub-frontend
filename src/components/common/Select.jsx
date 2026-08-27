export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-900 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
