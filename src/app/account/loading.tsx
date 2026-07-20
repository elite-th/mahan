export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-40 bg-[var(--surface-2)] rounded-xl mb-8" />
      <div className="bg-[var(--surface-1)] rounded-xl border border-[var(--border)] p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-10 h-10 bg-[var(--surface-2)] rounded-xl shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="h-5 w-1/3 bg-[var(--surface-2)] rounded-lg" />
              <div className="h-4 w-2/3 bg-[var(--surface-2)] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
