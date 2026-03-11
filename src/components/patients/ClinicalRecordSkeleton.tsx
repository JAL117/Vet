import { Skeleton } from "@/components/ui/Skeleton";

interface ClinicalRecordSkeletonProps {
  count?: number;
}

export default function ClinicalRecordSkeleton({ count = 4 }: ClinicalRecordSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <RecordCardSkeleton key={i} />
      ))}
    </div>
  );
}

function RecordCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 space-y-3">
      {/* Date pill + reason */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      {/* Diagnosis */}
      <Skeleton className="h-3.5 w-64" />
      {/* Weight + temp pills */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
