export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-48 bg-[var(--surface-2)] rounded-xl mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-6 space-y-4">
          <div className="h-6 w-32 bg-[var(--surface-2)] rounded-lg mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-[var(--surface-2)] rounded" />
              <div className="h-11 w-full bg-[var(--surface-2)] rounded-xl" />
            </div>
          ))}
          <div className="h-12 w-full bg-[var(--accent)]/30 rounded-xl mt-4" />
        </div>

        {/* Order summary */}
        <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-6 space-y-4 h-fit">
          <div className="h-6 w-32 bg-[var(--surface-2)] rounded-lg" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-16 h-16 bg-[var(--surface-2)] rounded-lg shrink-0" />
              <div className="flex-grow space-y-2">
                <div className="h-4 w-3/4 bg-[var(--surface-2)] rounded" />
                <div className="h-5 w-20 bg-[var(--surface-2)] rounded" />
              </div>
            </div>
          ))}
          <div className="h-px bg-[var(--surface-2)]" />
          <div className="flex justify-between">
            <div className="h-5 w-24 bg-[var(--surface-2)] rounded" />
            <div className="h-5 w-24 bg-[var(--surface-2)] rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
