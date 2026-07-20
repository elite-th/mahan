export default function SolutionsLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero */}
      <div className="relative bg-[var(--surface-1)] py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="h-10 w-64 bg-[var(--surface-2)] rounded-xl mb-4 mx-auto" />
          <div className="h-6 w-96 bg-[var(--surface-2)] rounded-xl mx-auto" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-6 space-y-3">
              <div className="h-10 w-10 bg-[var(--surface-2)] rounded-xl" />
              <div className="h-6 w-3/4 bg-[var(--surface-2)] rounded-lg" />
              <div className="h-4 w-full bg-[var(--surface-2)] rounded" />
              <div className="h-4 w-5/6 bg-[var(--surface-2)] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
