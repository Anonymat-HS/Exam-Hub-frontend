export function StudentResultsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full" role="status" aria-label="Chargement des résultats">
      <div className="mb-1 h-3 w-24 rounded-full bg-gray-100" />
      <div className="mb-1 h-7 w-48 rounded-full bg-gray-100" />
      <div className="mb-6 h-3 w-36 rounded-full bg-gray-100" />

      <div className="mt-8 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100/80">
            <div className="flex items-center gap-4">
              <span className="h-12 w-12 shrink-0 rounded-2xl bg-gray-100" />
              <div>
                <span className="mb-2 block h-4 w-48 rounded-full bg-gray-100" />
                <span className="block h-3 w-32 rounded-full bg-gray-100" />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-3 sm:pt-0">
              <span className="h-5 w-16 rounded-full bg-gray-100" />
              <span className="h-9 w-24 rounded-xl bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
