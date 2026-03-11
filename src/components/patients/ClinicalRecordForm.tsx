"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClinicalRecordFormData, emptyClinicalRecordForm } from "@/types/clinicalRecord";

interface ClinicalRecordFormProps {
  initialData?: ClinicalRecordFormData;
  onSubmit: (data: ClinicalRecordFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function ClinicalRecordForm({
  initialData,
  onSubmit,
  isEdit = false,
}: ClinicalRecordFormProps) {
  const { t } = useLanguage();
  const h = t.pages.historial;
  const [form, setForm] = useState<ClinicalRecordFormData>(initialData ?? emptyClinicalRecordForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof ClinicalRecordFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch {
      setError(h.errorSave);
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            {h.date} <span className="text-primary">*</span>
          </label>
          <input
            type="date"
            required
            value={form.date}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">{h.reason}</label>
          <input
            type="text"
            value={form.reason}
            onChange={(e) => set("reason", e.target.value)}
            placeholder={h.reasonPlaceholder}
            className={inputClass}
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">{h.weightKg}</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.weight_kg}
              onChange={(e) => set("weight_kg", e.target.value)}
              placeholder={h.weightPlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">kg</span>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">{h.temperature}</label>
          <div className="relative">
            <input
              type="number"
              min="30"
              max="45"
              step="0.1"
              value={form.temperature}
              onChange={(e) => set("temperature", e.target.value)}
              placeholder={h.temperaturePlaceholder}
              className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted">°C</span>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted mb-1.5">{h.diagnosis}</label>
          <input
            type="text"
            value={form.diagnosis}
            onChange={(e) => set("diagnosis", e.target.value)}
            placeholder={h.diagnosisPlaceholder}
            className={inputClass}
          />
        </div>

        {/* Treatment */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted mb-1.5">{h.treatment}</label>
          <textarea
            rows={3}
            value={form.treatment}
            onChange={(e) => set("treatment", e.target.value)}
            placeholder={h.treatmentPlaceholder}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-muted mb-1.5">{h.notes}</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder={h.notesPlaceholder}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </p>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-2">
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
              {isEdit ? h.updating : h.saving}
            </>
          ) : isEdit ? (
            h.update
          ) : (
            h.save
          )}
        </button>
      </div>
    </form>
  );
}
