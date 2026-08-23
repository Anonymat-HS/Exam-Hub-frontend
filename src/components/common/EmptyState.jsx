export function EmptyState({ icon: Icon, title, description, bubbleClass = 'bg-gray-50 text-gray-300' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-14 text-center">
      {Icon && (
        <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${bubbleClass}`}>
          <Icon size={22} />
        </div>
      )}
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {description && <p className="text-sm text-gray-400">{description}</p>}
    </div>
  );
}
