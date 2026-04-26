export function EpisodeNavSkeleton() {
  return (
    <div className="rounded-lg border border-gray-100 border-b-[6px] p-4 md:p-6 bg-white/80">
      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
