export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-10 w-48 bg-[var(--surface-2)] rounded-xl mb-3" />
        <div className="h-5 w-72 bg-[var(--surface-2)] rounded-xl" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col h-full bg-[var(--surface-1)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="aspect-[4/3] bg-[var(--surface-2)]" />
            <div className="p-6 flex flex-col flex-grow">
              <div className="h-5 w-3/4 bg-[var(--surface-2)] rounded-lg mb-4" />
              <div className="mt-auto">
                <div className="h-3 w-16 bg-[var(--surface-2)] rounded mb-1" />
                <div className="h-7 w-24 bg-[var(--surface-2)] rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
