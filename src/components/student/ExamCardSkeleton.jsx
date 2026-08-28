export function ExamCardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full" role="status" aria-label="Chargement des examens">
      <div className="mb-1 h-3 w-24 rounded-full bg-gray-100" />
      <div className="mb-1 h-7 w-64 rounded-full bg-gray-100" />
      <div className="mb-6 h-3 w-48 rounded-full bg-gray-100" />

      <div className="mb-6 rounded-3xl bg-gray-100 p-6 sm:p-8 animate-pulse">
        <div className="flex items-center gap-4">
          <span className="h-12 w-12 rounded-2xl bg-gray-200" />
          <div>
            <span className="mb-2 block h-3 w-40 rounded-full bg-gray-200" />
            <span className="block h-3 w-64 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="h-10 w-10 rounded-xl bg-gray-100" />
              <span className="h-6 w-20 rounded-full bg-gray-100" />
            </div>
            <span className="mt-6 block h-5 w-48 rounded-full bg-gray-100" />
            <span className="mt-2 block h-3 w-full rounded-full bg-gray-100" />
            <span className="mt-2 block h-3 w-3/4 rounded-full bg-gray-100" />
            <div className="mt-6 flex items-center gap-4">
              <span className="h-3 w-20 rounded-full bg-gray-100" />
              <span className="h-3 w-32 rounded-full bg-gray-100" />
            </div>
            <span className="mt-5 block h-10 w-full rounded-xl bg-gray-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
