export default function HomeLoading() {
  return (
    <div className="relative h-screen -mt-20 bg-slate-900 flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="h-12 w-64 bg-slate-700/50 rounded-xl mb-4 mx-auto" />
        <div className="h-6 w-96 bg-slate-700/50 rounded-xl mb-2 mx-auto" />
        <div className="h-6 w-72 bg-slate-700/50 rounded-xl mx-auto" />
      </div>
    </div>
  );
}
