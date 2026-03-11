"use client";

export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PatientFormData } from "@/types/patient";
import { useLanguage } from "@/contexts/LanguageContext";
import PatientForm from "@/components/patients/PatientForm";

export default function NuevoPacientePage() {
  const { t } = useLanguage();
  const p = t.pages.pacientes;
  const router = useRouter();

  async function handleSubmit(data: PatientFormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const payload = {
      user_id: user.id,
      name: data.name,
      species: data.species,
      breed: data.breed || null,
      sex: data.sex || null,
      neutered: data.neutered,
      birth_date: data.birth_date || null,
      weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
      color: data.color || null,
      microchip: data.microchip || null,
      owner_name: data.owner_name,
      owner_phone: data.owner_phone || null,
      owner_email: data.owner_email || null,
      owner_address: data.owner_address || null,
      allergies: data.allergies || null,
      notes: data.notes || null,
    };

    const { data: newPatient, error } = await supabase
      .from("patients")
      .insert(payload)
      .select("id")
      .single();

    if (error) throw error;
    router.push(`/pacientes/${newPatient.id}`);
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <PawPrint className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{p.createTitle}</h1>
            <p className="text-sm text-muted">{p.createSubtitle}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <PatientForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
