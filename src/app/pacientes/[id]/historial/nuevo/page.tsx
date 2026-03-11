"use client";

export const dynamic = "force-dynamic";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ClinicalRecordFormData } from "@/types/clinicalRecord";
import { useLanguage } from "@/contexts/LanguageContext";
import ClinicalRecordForm from "@/components/patients/ClinicalRecordForm";

export default function NuevoRegistroPage() {
  const { t } = useLanguage();
  const h = t.pages.historial;
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  async function handleSubmit(data: ClinicalRecordFormData) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const payload = {
      patient_id: id,
      user_id: user.id,
      date: data.date,
      reason: data.reason || null,
      weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
      temperature: data.temperature ? parseFloat(data.temperature) : null,
      diagnosis: data.diagnosis || null,
      treatment: data.treatment || null,
      notes: data.notes || null,
    };

    const { error } = await supabase.from("clinical_records").insert(payload);
    if (error) throw error;
    router.push(`/pacientes/${id}/historial`);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/pacientes/${id}/historial`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {h.backToPatient}
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{h.newRecord}</h1>
            <p className="text-sm text-muted">{h.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <ClinicalRecordForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
