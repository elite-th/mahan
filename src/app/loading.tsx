export default function HomeLoading() {
  return (
    <div className="relative h-screen -mt-20 bg-[var(--bg)] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="h-12 w-64 bg-[var(--surface-2)] rounded-xl mb-4 mx-auto" />
        <div className="h-6 w-96 bg-[var(--surface-2)] rounded-xl mb-2 mx-auto" />
        <div className="h-6 w-72 bg-[var(--surface-2)] rounded-xl mx-auto" />
      </div>
    </div>
  );
}
