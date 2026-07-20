export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-40 bg-[var(--surface-2)] rounded-xl mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-[var(--surface-1)] rounded-xl border border-[var(--border)]">
              <div className="w-24 h-24 bg-[var(--surface-2)] rounded-xl shrink-0" />
              <div className="flex-grow space-y-2">
                <div className="h-5 w-3/4 bg-[var(--surface-2)] rounded-lg" />
                <div className="h-7 w-24 bg-[var(--surface-2)] rounded-lg" />
              </div>
              <div className="w-8 h-8 bg-[var(--surface-2)] rounded-lg self-center" />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-6 space-y-4 h-fit">
          <div className="h-6 w-32 bg-[var(--surface-2)] rounded-lg" />
          <div className="h-px bg-[var(--surface-2)]" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-[var(--surface-2)] rounded" />
              <div className="h-4 w-20 bg-[var(--surface-2)] rounded" />
            </div>
          ))}
          <div className="h-12 w-full bg-[var(--accent)]/30 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
