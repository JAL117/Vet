"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PawPrint } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Patient, PatientFormData } from "@/types/patient";
import { useLanguage } from "@/contexts/LanguageContext";
import PatientForm from "@/components/patients/PatientForm";

export default function EditarPacientePage() {
  const { t } = useLanguage();
  const p = t.pages.pacientes;
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  async function handleSubmit(data: PatientFormData) {
    const payload = {
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

    const { error } = await supabase
      .from("patients")
      .update(payload)
      .eq("id", id);

    if (error) throw error;
    router.push(`/pacientes/${id}`);
  }

  function toFormData(pt: Patient): PatientFormData {
    return {
      name: pt.name,
      species: pt.species,
      breed: pt.breed ?? "",
      sex: pt.sex ?? "",
      neutered: pt.neutered,
      birth_date: pt.birth_date ?? "",
      weight_kg: pt.weight_kg != null ? String(pt.weight_kg) : "",
      color: pt.color ?? "",
      microchip: pt.microchip ?? "",
      owner_name: pt.owner_name,
      owner_phone: pt.owner_phone ?? "",
      owner_email: pt.owner_email ?? "",
      owner_address: pt.owner_address ?? "",
      allergies: pt.allergies ?? "",
      notes: pt.notes ?? "",
    };
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
      {/* Header */}
      <div>
        <Link
          href={`/pacientes/${id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          {p.back}
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <PawPrint className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{p.editTitle}</h1>
            <p className="text-sm text-muted">{patient.name}</p>
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <PatientForm
          initialData={toFormData(patient)}
          onSubmit={handleSubmit}
          isEdit
        />
      </div>
    </div>
  );
}
