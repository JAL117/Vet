"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Edit2, Stethoscope, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ClinicalRecord, ClinicalRecordFormData, formatDate } from "@/types/clinicalRecord";
import { useLanguage } from "@/contexts/LanguageContext";
import ClinicalRecordForm from "@/components/patients/ClinicalRecordForm";
import ClinicalRecordSkeleton from "@/components/patients/ClinicalRecordSkeleton";

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  const { t } = useLanguage();
  const h = t.pages.historial;
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-xs text-muted flex-shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right whitespace-pre-wrap">
        {value || h.noData}
      </span>
    </div>
  );
}

export default function RecordDetailPage() {
  const { t } = useLanguage();
  const h = t.pages.historial;
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const recordId = params.recordId as string;

  const [record, setRecord] = useState<ClinicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data, error } = await supabase
        .from("clinical_records")
        .select("*")
        .eq("id", recordId)
        .single();
      if (!error) setRecord(data);
      setLoading(false);
    }
    load();
  }, [recordId]);

  async function handleUpdate(data: ClinicalRecordFormData) {
    const supabase = createClient();
    const payload = {
      date: data.date,
      reason: data.reason || null,
      weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
      temperature: data.temperature ? parseFloat(data.temperature) : null,
      diagnosis: data.diagnosis || null,
      treatment: data.treatment || null,
      notes: data.notes || null,
    };
    const { data: updated, error } = await supabase
      .from("clinical_records")
      .update(payload)
      .eq("id", recordId)
      .select()
      .single();
    if (error) throw error;
    setRecord(updated);
    setIsEditing(false);
  }

  async function handleDelete() {
    const supabase = createClient();
    setDeleting(true);
    setDeleteError(null);
    const { error } = await supabase.from("clinical_records").delete().eq("id", recordId);
    if (error) {
      setDeleteError(h.errorDelete);
      setDeleting(false);
    } else {
      router.push(`/pacientes/${id}/historial`);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-3.5 w-32 rounded bg-surface-hover animate-pulse" />
        <ClinicalRecordSkeleton count={1} />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Registro no encontrado.</p>
        <Link
          href={`/pacientes/${id}/historial`}
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          {h.back}
        </Link>
      </div>
    );
  }

  const formData: ClinicalRecordFormData = {
    date: record.date,
    reason: record.reason ?? "",
    weight_kg: record.weight_kg?.toString() ?? "",
    temperature: record.temperature?.toString() ?? "",
    diagnosis: record.diagnosis ?? "",
    treatment: record.treatment ?? "",
    notes: record.notes ?? "",
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Link
          href={`/pacientes/${id}/historial`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {h.backToPatient}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 flex-shrink-0">
              <CalendarDays className="h-4 w-4 text-primary" strokeWidth={2} />
              <span className="text-sm font-semibold text-primary">{formatDate(record.date)}</span>
            </div>
            {record.reason && (
              <p className="text-sm font-medium text-foreground line-clamp-1">{record.reason}</p>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary flex-shrink-0"
            >
              <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">{h.edit}</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit form */}
      {isEditing ? (
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Stethoscope className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
            </div>
            <p className="text-sm font-semibold text-foreground">{h.update}</p>
          </div>
          <ClinicalRecordForm initialData={formData} onSubmit={handleUpdate} isEdit />
          <button
            onClick={() => setIsEditing(false)}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            {h.cancel}
          </button>
        </div>
      ) : (
        /* Detail view */
        <div className="rounded-2xl border border-border bg-surface p-5 space-y-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            {h.title}
          </p>
          <InfoRow label={h.reason} value={record.reason} />
          <InfoRow
            label={h.weightKg}
            value={record.weight_kg ? `${record.weight_kg} kg` : null}
          />
          <InfoRow
            label={h.temperature}
            value={record.temperature ? `${record.temperature} °C` : null}
          />
          <InfoRow label={h.diagnosis} value={record.diagnosis} />
          <InfoRow label={h.treatment} value={record.treatment} />
          <InfoRow label={h.notes} value={record.notes} />
        </div>
      )}

      {/* Danger zone */}
      {!isEditing && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-800/30 dark:bg-red-900/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600/70 dark:text-red-400/70 mb-3">
            Zona de peligro
          </p>
          {deleteError && (
            <p className="mb-3 text-sm text-red-700 dark:text-red-400">{deleteError}</p>
          )}
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} />
              {h.delete}
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {h.confirmDeleteTitle}
              </p>
              <p className="text-xs text-red-600/70 dark:text-red-400/70">{h.confirmDeleteMsg}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {h.deleting}
                    </>
                  ) : (
                    h.confirmDeleteBtn
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-surface-hover"
                >
                  {h.cancel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
