export function TakeExamSkeleton() {
  return (
    <div className="max-w-4xl mx-auto w-full pb-16" role="status" aria-label="Chargement de l'examen">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
        <div>
          <span className="mb-2 block h-3 w-28 rounded-full bg-gray-100" />
          <span className="block h-7 w-56 rounded-full bg-gray-100" />
        </div>
        <div className="text-right">
          <span className="mb-1 block h-3 w-20 rounded-full bg-gray-100 ml-auto" />
          <span className="block h-6 w-12 rounded-full bg-gray-100 ml-auto" />
        </div>
      </div>

      <div className="mb-8 rounded-2xl bg-gray-100 p-6 sm:p-8 animate-pulse">
        <span className="mb-2 block h-3 w-48 rounded-full bg-gray-200" />
        <span className="block h-7 w-56 rounded-full bg-gray-200" />
      </div>

      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="h-8 w-8 shrink-0 rounded-xl bg-gray-100" />
                <span className="h-5 w-64 rounded-full bg-gray-100" />
              </div>
              <span className="h-4 w-12 rounded-full bg-gray-100 shrink-0" />
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((j) => (
                <span key={j} className="flex items-center gap-4 rounded-xl p-4 bg-gray-50">
                  <span className="h-7 w-7 shrink-0 rounded-lg bg-gray-100" />
                  <span className="h-4 w-48 rounded-full bg-gray-100" />
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
