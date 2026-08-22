export function StatCard({ icon: Icon, iconBg, iconColor, label, value, sublabel }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}><Icon size={20} /></div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{sublabel}</p>
    </div>
  );
}