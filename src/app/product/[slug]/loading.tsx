export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-48 bg-slate-700/50 rounded-lg mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-800/60 rounded-xl" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 bg-slate-800/60 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-slate-700/50 rounded-xl" />
          <div className="h-10 w-1/3 bg-slate-700/50 rounded-xl" />
          <div className="h-4 w-full bg-slate-700/50 rounded-lg" />
          <div className="h-4 w-5/6 bg-slate-700/50 rounded-lg" />
          <div className="h-4 w-4/6 bg-slate-700/50 rounded-lg" />
          <div className="h-12 w-full bg-sky-600/30 rounded-xl mt-6" />
          <div className="h-12 w-full bg-slate-700/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
