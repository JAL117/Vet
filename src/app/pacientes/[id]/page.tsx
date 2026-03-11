"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Patient, formatAge } from "@/types/patient";
import { useLanguage } from "@/contexts/LanguageContext";

const SPECIES_EMOJI: Record<string, string> = {
  perro: "🐶",
  gato: "🐱",
  otro: "🐾",
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  const { t } = useLanguage();
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-xs text-muted flex-shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{value || t.pages.pacientes.noData}</span>
    </div>
  );
}

export default function PatientDetailPage() {
  const { t } = useLanguage();
  const p = t.pages.pacientes;
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) setPatient(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    const supabase = createClient();
    setDeleting(true);
    setDeleteError(null);
    const { error } = await supabase.from("patients").delete().eq("id", id);
    if (error) {
      setDeleteError(p.errorDelete);
      setDeleting(false);
    } else {
      router.push("/pacientes");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-16">
        <p className="text-muted">Paciente no encontrado.</p>
        <Link href="/pacientes" className="mt-4 inline-block text-sm text-primary hover:underline">
          {p.backToList}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/pacientes"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {p.backToList}
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-2xl flex-shrink-0">
              {SPECIES_EMOJI[patient.species] ?? "🐾"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
              <p className="text-sm text-muted">
                {patient.breed ?? p.noData} · {patient.owner_name}
              </p>
            </div>
          </div>

          <Link
            href={`/pacientes/${id}/editar`}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:text-primary flex-shrink-0"
          >
            <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden sm:inline">{p.edit}</span>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 space-y-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{p.patientInfo}</p>
        <InfoRow label={p.species} value={patient.species === "perro" ? p.speciesDog : patient.species === "gato" ? p.speciesCat : p.speciesOther} />
        <InfoRow label={p.breed} value={patient.breed} />
        <InfoRow label={p.sex} value={patient.sex === "macho" ? p.sexMale : patient.sex === "hembra" ? p.sexFemale : p.sexUnknown} />
        <InfoRow label={p.neutered} value={patient.neutered ? p.yesNeutered : p.notNeutered} />
        <InfoRow label={p.age} value={patient.birth_date ? formatAge(patient.birth_date) : p.noAge} />
        <InfoRow label={p.birthDate} value={patient.birth_date ?? undefined} />
        <InfoRow label={p.weightKg} value={patient.weight_kg ? `${patient.weight_kg} kg` : undefined} />
        <InfoRow label={p.color} value={patient.color} />
        <InfoRow label={p.microchip} value={patient.microchip} />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{p.ownerInfo}</p>
        <InfoRow label={p.ownerName} value={patient.owner_name} />
        <InfoRow label={p.ownerPhone} value={patient.owner_phone} />
        <InfoRow label={p.ownerEmail} value={patient.owner_email} />
        <InfoRow label={p.ownerAddress} value={patient.owner_address} />
      </div>

      {(patient.allergies || patient.notes) && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{p.clinicalInfo}</p>
          {patient.allergies && <InfoRow label={p.allergies} value={patient.allergies} />}
          {patient.notes && (
            <div className="py-3">
              <p className="text-xs text-muted mb-1">{p.notes}</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{patient.notes}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-muted text-right">
        {p.registeredOn} {new Date(patient.created_at).toLocaleDateString()}
      </p>

      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 dark:border-red-800/30 dark:bg-red-900/10">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-600/70 dark:text-red-400/70 mb-3">{p.dangerZone}</p>
        {deleteError && (
          <p className="mb-3 text-sm text-red-700 dark:text-red-400">{deleteError}</p>
        )}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
            {p.delete}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">{p.confirmDeleteTitle}</p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70">{p.confirmDeleteMsg}</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {p.deleting}
                  </>
                ) : (
                  p.confirmDeleteBtn
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-surface-hover"
              >
                {p.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
