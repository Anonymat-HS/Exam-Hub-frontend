export function ExamResultSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full pb-16" role="status" aria-label="Chargement du résultat">
      <div className="flex items-center justify-between pb-4">
        <div>
          <span className="mb-1 block h-3 w-20 rounded-full bg-gray-100" />
          <span className="mb-1 block h-8 w-48 rounded-full bg-gray-100" />
          <span className="block h-4 w-40 rounded-full bg-gray-100" />
        </div>
        <span className="h-4 w-20 rounded-full bg-gray-100" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 animate-pulse rounded-3xl bg-gray-100 p-8">
          <span className="mb-6 block h-3 w-24 rounded-full bg-gray-200" />
          <div className="my-6 flex items-baseline gap-2">
            <span className="block h-16 w-16 rounded-full bg-gray-200" />
            <span className="block h-8 w-12 rounded-full bg-gray-200" />
          </div>
          <span className="block h-5 w-36 rounded-full bg-gray-200" />
        </div>

        <div className="lg:col-span-7 animate-pulse rounded-3xl bg-white p-8 border border-gray-100">
          <span className="mb-6 block h-5 w-24 rounded-full bg-gray-100" />
          <div className="grid grid-cols-2 gap-4">
            <span className="h-24 rounded-2xl bg-gray-50" />
            <span className="h-24 rounded-2xl bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="mt-10">
        <span className="mb-6 block h-5 w-48 rounded-full bg-gray-100" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl bg-white p-6 sm:p-8 border border-gray-100">
              <div className="flex items-start gap-3 mb-6">
                <span className="h-8 w-8 shrink-0 rounded-full bg-gray-100" />
                <div>
                  <span className="mb-1 block h-3 w-24 rounded-full bg-gray-100" />
                  <span className="block h-5 w-64 rounded-full bg-gray-100" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <span className="h-20 rounded-2xl bg-gray-50" />
                <span className="h-20 rounded-2xl bg-gray-50" />
              </div>
              <span className="mt-3 block h-3 w-24 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
