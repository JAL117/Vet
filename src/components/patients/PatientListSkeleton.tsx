import { Skeleton } from "@/components/ui/Skeleton";

export default function PatientListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-60" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-xl sm:w-36" />
      </div>

      {/* Search + filter */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="flex gap-2">
          {["w-20", "w-16", "w-14", "w-14"].map((w, i) => (
            <Skeleton key={i} className={`h-7 rounded-xl ${w}`} />
          ))}
        </div>
      </div>

      {/* List rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5"
          >
            <Skeleton className="h-10 w-10 flex-shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1.5">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
