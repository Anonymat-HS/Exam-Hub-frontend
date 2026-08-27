export function PageHeader({ subtitle, title, action, actionLabel, actionIcon: ActionIcon }) {
  return (
    <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
      <div>
        {subtitle && (
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {subtitle}
          </span>
        )}
        <h1 className={`text-2xl sm:text-3xl font-extrabold text-gray-900 ${subtitle ? 'mt-0.5' : ''}`}>
          {title}
        </h1>
      </div>
      {action && (
        <button
          onClick={action}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
        >
          {ActionIcon && <ActionIcon size={16} />}
          {actionLabel}
        </button>
      )}
    </div>
  );
}
