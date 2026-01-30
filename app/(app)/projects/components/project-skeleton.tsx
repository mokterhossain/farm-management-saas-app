export default function ProjectSkeletonGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="h-4 w-2/3 bg-white/10 rounded mb-3" />
          <div className="h-3 w-1/2 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
