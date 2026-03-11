"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus, Stethoscope } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ClinicalRecord, formatDate } from "@/types/clinicalRecord";
import { useLanguage } from "@/contexts/LanguageContext";
import ClinicalRecordSkeleton from "@/components/patients/ClinicalRecordSkeleton";

export default function HistorialPage() {
  const { t } = useLanguage();
  const h = t.pages.historial;
  const params = useParams();
  const id = params.id as string;

  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data, error } = await supabase
        .from("clinical_records")
        .select("*")
        .eq("patient_id", id)
        .order("date", { ascending: false });
      if (error) {
        setError(h.errorLoad);
      } else {
        setRecords(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id, h.errorLoad]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/pacientes/${id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {h.backToPatient}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <Stethoscope className="h-5 w-5 text-primary" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{h.title}</h1>
              <p className="text-sm text-muted">{h.subtitle}</p>
            </div>
          </div>

          <Link
            href={`/pacientes/${id}/historial/nuevo`}
            className="flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 flex-shrink-0"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">{h.newRecord}</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <ClinicalRecordSkeleton count={4} />
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      ) : records.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8">
            <Stethoscope className="h-6 w-6 text-primary/50" strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-foreground">{h.empty}</p>
          <p className="mt-1 text-sm text-muted">{h.emptySubtitle}</p>
          <Link
            href={`/pacientes/${id}/historial/nuevo`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {h.addFirst}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted">{h.recordsCount(records.length)}</p>
          {records.map((record) => (
            <RecordCard key={record.id} record={record} patientId={id} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordCard({
  record,
  patientId,
  h,
}: {
  record: ClinicalRecord;
  patientId: string;
  h: ReturnType<typeof useLanguage>["t"]["pages"]["historial"];
}) {
  return (
    <Link
      href={`/pacientes/${patientId}/historial/${record.id}`}
      className="block rounded-2xl border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 flex-shrink-0">
          <CalendarDays className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
          <span className="text-xs font-semibold text-primary">{formatDate(record.date)}</span>
        </div>
        {record.reason && (
          <p className="text-sm font-medium text-foreground line-clamp-1">{record.reason}</p>
        )}
      </div>

      {record.diagnosis && (
        <p className="mt-2 text-xs text-muted line-clamp-2 pl-1">{record.diagnosis}</p>
      )}

      {(record.weight_kg || record.temperature) && (
        <div className="mt-2 flex gap-2">
          {record.weight_kg && (
            <span className="rounded-full bg-surface-hover border border-border px-2 py-0.5 text-xs text-muted">
              {record.weight_kg} kg
            </span>
          )}
          {record.temperature && (
            <span className="rounded-full bg-surface-hover border border-border px-2 py-0.5 text-xs text-muted">
              {record.temperature} °C
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
