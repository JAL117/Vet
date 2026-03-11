"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatientFormData, emptyPatientForm } from "@/types/patient";

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmit: (data: PatientFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function PatientForm({ initialData, onSubmit, isEdit = false }: PatientFormProps) {
  const { t } = useLanguage();
  const p = t.pages.pacientes;
  const [form, setForm] = useState<PatientFormData>(initialData ?? emptyPatientForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof PatientFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch {
      setError(p.errorSave);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Patient data */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
          {p.patientSection}
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted mb-1.5">
              {p.name} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder={p.namePlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {p.species} <span className="text-primary">*</span>
            </label>
            <select
              required
              value={form.species}
              onChange={(e) => set("species", e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            >
              <option value="perro">{p.speciesDog}</option>
              <option value="gato">{p.speciesCat}</option>
              <option value="otro">{p.speciesOther}</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.breed}</label>
            <input
              type="text"
              value={form.breed}
              onChange={(e) => set("breed", e.target.value)}
              placeholder={p.breedPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.sex}</label>
            <select
              value={form.sex}
              onChange={(e) => set("sex", e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            >
              <option value="">{p.sexUnknown}</option>
              <option value="macho">{p.sexMale}</option>
              <option value="hembra">{p.sexFemale}</option>
            </select>
          </div>

          {/* Neutered */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.neutered}
              onClick={() => set("neutered", !form.neutered)}
              className={`relative flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                form.neutered
                  ? "border-primary bg-primary"
                  : "border-border bg-surface hover:border-primary/50"
              }`}
            >
              {form.neutered && (
                <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <label
              className="text-sm text-foreground cursor-pointer select-none"
              onClick={() => set("neutered", !form.neutered)}
            >
              {p.neutered}
            </label>
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.birthDate}</label>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => set("birth_date", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.weightKg}</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.weight_kg}
                onChange={(e) => set("weight_kg", e.target.value)}
                placeholder={p.weightPlaceholder}
                className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">kg</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.color}</label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder={p.colorPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Microchip */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.microchip}</label>
            <input
              type="text"
              value={form.microchip}
              onChange={(e) => set("microchip", e.target.value)}
              placeholder={p.microchipPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </fieldset>

      <div className="border-t border-border" />

      {/* Owner data */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
          {p.ownerSection}
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Owner name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted mb-1.5">
              {p.ownerName} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              value={form.owner_name}
              onChange={(e) => set("owner_name", e.target.value)}
              placeholder={p.ownerNamePlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.ownerPhone}</label>
            <input
              type="tel"
              value={form.owner_phone}
              onChange={(e) => set("owner_phone", e.target.value)}
              placeholder={p.ownerPhonePlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.ownerEmail}</label>
            <input
              type="email"
              value={form.owner_email}
              onChange={(e) => set("owner_email", e.target.value)}
              placeholder={p.ownerEmailPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted mb-1.5">{p.ownerAddress}</label>
            <input
              type="text"
              value={form.owner_address}
              onChange={(e) => set("owner_address", e.target.value)}
              placeholder={p.ownerAddressPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
      </fieldset>

      <div className="border-t border-border" />

      {/* Clinical info */}
      <fieldset className="space-y-5">
        <legend className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
          {p.clinicalSection}
        </legend>

        <div className="grid grid-cols-1 gap-4">
          {/* Allergies */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.allergies}</label>
            <input
              type="text"
              value={form.allergies}
              onChange={(e) => set("allergies", e.target.value)}
              placeholder={p.allergiesPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">{p.notes}</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder={p.notesPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
            />
          </div>
        </div>
      </fieldset>

      {/* Error */}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted">{p.required}</p>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isEdit ? p.updating : p.saving}
            </>
          ) : (
            isEdit ? p.update : p.save
          )}
        </button>
      </div>
    </form>
  );
}
