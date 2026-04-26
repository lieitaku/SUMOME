import { cn } from "@/lib/utils";

export default function AnimationLoading() {
  return (
    <div className="antialiased bg-[#F4F5F7] min-h-screen flex flex-col">
      <div className="h-10 md:h-12 bg-gradient-to-b from-gray-800 to-gray-900 animate-pulse" />
      <main className="grow container mx-auto max-w-4xl px-6 py-8 md:py-12">
        <div className="h-8 w-2/3 max-w-sm rounded bg-gray-200 animate-pulse mb-4" />
        <div
          className={cn(
            "w-full aspect-video rounded-lg bg-gray-200 animate-pulse",
            "border border-gray-100 border-b-[6px] border-b-gray-300/40"
          )}
        />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-200/80 animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}
