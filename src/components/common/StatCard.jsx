export function StatCard({ icon: Icon, iconBg, iconColor, label, value, sublabel, trend }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trend.direction === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-navy">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}
