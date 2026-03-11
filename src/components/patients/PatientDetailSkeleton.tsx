import { Skeleton } from "@/components/ui/Skeleton";

export default function PatientDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Skeleton className="h-3.5 w-32" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3.5 w-52" />
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-xl flex-shrink-0" />
      </div>

      {/* Info card */}
      <InfoCardSkeleton rows={9} />

      {/* Owner card */}
      <InfoCardSkeleton rows={4} />

      {/* Clinical card */}
      <InfoCardSkeleton rows={2} />
    </div>
  );
}

function InfoCardSkeleton({ rows }: { rows: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 space-y-0">
      <Skeleton className="h-3 w-28 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-3 border-b border-border last:border-0">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3.5 w-28" />
        </div>
      ))}
    </div>
  );
}
