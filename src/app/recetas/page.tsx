"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ClipboardList, Download, Search, X, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";
import Disclaimer from "@/components/Disclaimer";
import { useLanguage } from "@/contexts/LanguageContext";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  veterinario: string;
  cedula: string;
  paciente: string;
  especieRaza: string;
  peso: string;
  propietario: string;
  diagnostico: string;
  tratamiento: string;
  indicaciones: string;
  fecha: string;
}

interface PatientOption {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  weight_kg: number | null;
  owner_name: string;
}

function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
}

export default function RecetasPage() {
  const { t } = useLanguage();
  const p = t.pages.documentos;

  const [form, setForm] = useState<FormData>({
    veterinario: "", cedula: "", paciente: "", especieRaza: "",
    peso: "", propietario: "", diagnostico: "", tratamiento: "",
    indicaciones: "", fecha: getTodayDate(),
  });
  const [generating, setGenerating] = useState(false);

  // Patient lookup state
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    async function loadPatients() {
      const { data } = await supabase
        .from("patients")
        .select("id, name, species, breed, weight_kg, owner_name")
        .order("name", { ascending: true });
      setPatients(data ?? []);
    }
    loadPatients();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPatients = patientSearch.trim()
    ? patients.filter((pt) => pt.name.toLowerCase().includes(patientSearch.toLowerCase()))
    : patients;

  function selectPatient(pt: PatientOption) {
    const especieRaza = [pt.species, pt.breed].filter(Boolean).join(" - ");
    setForm((prev) => ({
      ...prev,
      paciente: pt.name,
      especieRaza,
      peso: pt.weight_kg != null ? String(pt.weight_kg) : "",
      propietario: pt.owner_name,
    }));
    setSelectedPatientName(pt.name);
    setPatientSearch("");
    setShowDropdown(false);
  }

  function clearPatientSelection() {
    setSelectedPatientName(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generatePDF = () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      doc.setDrawColor(13, 148, 136);
      doc.setLineWidth(0.8);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(13, 148, 136);
      doc.text("RECETA VETERINARIA", pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setDrawColor(13, 148, 136);
      doc.setLineWidth(0.8);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Fecha: ${formatDate(form.fecha)}`, pageWidth - margin, y, { align: "right" });
      y += 10;

      const addField = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`${label}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        const labelWidth = doc.getTextWidth(`${label}: `);
        doc.text(value || "—", margin + labelWidth, y);
        y += 7;
      };

      const addMultilineField = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`${label}:`, margin, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        const lines = doc.splitTextToSize(value || "—", contentWidth - 5);
        doc.text(lines, margin + 5, y);
        y += lines.length * 5 + 4;
      };

      const addSection = (title: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(13, 148, 136);
        doc.text(title, margin, y);
        y += 2;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
      };

      addSection("DATOS DEL PROFESIONAL");
      addField("Medico Veterinario", form.veterinario);
      addField("Cedula Profesional", form.cedula);
      y += 4;

      addSection("DATOS DEL PACIENTE");
      addField("Paciente", form.paciente);
      addField("Especie / Raza", form.especieRaza);
      addField("Peso", form.peso ? `${form.peso} kg` : "");
      addField("Propietario", form.propietario);
      y += 4;

      addSection("DIAGNOSTICO Y TRATAMIENTO");
      addMultilineField("Diagnostico", form.diagnostico);
      addMultilineField("Tratamiento / Prescripcion", form.tratamiento);
      addMultilineField("Indicaciones", form.indicaciones);

      y = Math.max(y + 10, 240);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageWidth - margin, y);
      y += 5;

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      const disclaimer = "Esta receta fue generada con PawCure como apoyo al criterio clinico. Los resultados deben ser verificados por el profesional medico veterinario responsable. PawCure no se hace responsable por decisiones clinicas basadas unicamente en estos calculos.";
      const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth);
      doc.text(disclaimerLines, margin, y);
      y += disclaimerLines.length * 4 + 6;

      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.4);
      const sigLineWidth = 70;
      const sigX = (pageWidth - sigLineWidth) / 2;
      doc.line(sigX, y, sigX + sigLineWidth, y);
      y += 5;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text("Firma del Medico Veterinario", pageWidth / 2, y, { align: "center" });

      const fileName = `receta_${form.paciente.replace(/\s+/g, "_") || "veterinaria"}_${form.fecha}.pdf`;
      doc.save(fileName);
    } finally {
      setGenerating(false);
    }
  };

  const isFormValid = form.veterinario.trim() && form.paciente.trim() && form.propietario.trim();

  return (
    <div>
      {/* Module header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {p.title}
            </h1>
            <p className="text-sm text-muted">{p.subtitle}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); generatePDF(); }}
        className="space-y-6"
      >
        {/* Professional Data */}
        <fieldset className="rounded-2xl border border-border bg-surface p-6">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-primary">
            {p.professionalSection}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="veterinario" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.vetName} *
              </label>
              <input
                type="text" id="veterinario" name="veterinario"
                value={form.veterinario} onChange={handleChange} required
                placeholder={p.vetNamePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="cedula" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.license}
              </label>
              <input
                type="text" id="cedula" name="cedula"
                value={form.cedula} onChange={handleChange}
                placeholder={p.licensePlaceholder}
              />
            </div>
          </div>
        </fieldset>

        {/* Patient Data */}
        <fieldset className="rounded-2xl border border-border bg-surface p-6">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-primary">
            {p.patientSection}
          </legend>

          {/* Patient lookup */}
          <div className="mb-5 rounded-xl border border-border bg-background p-3.5">
            <p className="mb-2 text-xs font-semibold text-muted">{p.searchPatientLabel}</p>

            {selectedPatientName ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-primary/8 px-3 py-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs font-medium text-primary">{p.patientLoaded}</span>
                  <span className="text-xs font-semibold text-foreground">{selectedPatientName}</span>
                </div>
                <button
                  type="button"
                  onClick={clearPatientSelection}
                  className="flex items-center gap-1 rounded-xl border border-border px-2.5 py-2 text-xs font-medium text-muted transition-all hover:border-red-300 hover:text-red-500"
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                  {p.clearPatient}
                </button>
              </div>
            ) : (
              <div ref={dropdownRef} className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={2} />
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={p.searchPatientPlaceholder}
                  className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
                    {filteredPatients.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-muted">{p.noPatientsFound}</p>
                    ) : (
                      filteredPatients.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onMouseDown={() => selectPatient(pt)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-hover"
                        >
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8 text-base">
                            {pt.species === "perro" ? "🐶" : pt.species === "gato" ? "🐱" : "🐾"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{pt.name}</p>
                            <p className="text-xs text-muted truncate">
                              {[pt.breed, pt.owner_name].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          {pt.weight_kg && (
                            <span className="ml-auto flex-shrink-0 text-xs text-muted">{pt.weight_kg} kg</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="paciente" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.patientName} *
              </label>
              <input
                type="text" id="paciente" name="paciente"
                value={form.paciente} onChange={handleChange} required
                placeholder={p.patientNamePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="especieRaza" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.speciesBreed}
              </label>
              <input
                type="text" id="especieRaza" name="especieRaza"
                value={form.especieRaza} onChange={handleChange}
                placeholder={p.speciesBreedPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="peso" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.weightKg}
              </label>
              <input
                type="text" id="peso" name="peso"
                value={form.peso} onChange={handleChange}
                placeholder={p.weightPlaceholder}
              />
            </div>
            <div>
              <label htmlFor="propietario" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.owner} *
              </label>
              <input
                type="text" id="propietario" name="propietario"
                value={form.propietario} onChange={handleChange} required
                placeholder={p.ownerPlaceholder}
              />
            </div>
          </div>
        </fieldset>

        {/* Diagnosis & Treatment */}
        <fieldset className="rounded-2xl border border-border bg-surface p-6">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-primary">
            {p.treatmentSection}
          </legend>
          <div className="space-y-5">
            <div>
              <label htmlFor="diagnostico" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.diagnosis}
              </label>
              <textarea
                id="diagnostico" name="diagnostico"
                value={form.diagnostico} onChange={handleChange}
                rows={2} placeholder={p.diagnosisPlaceholder}
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="tratamiento" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.prescription}
              </label>
              <textarea
                id="tratamiento" name="tratamiento"
                value={form.tratamiento} onChange={handleChange}
                rows={4} placeholder={p.prescriptionPlaceholder}
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="indicaciones" className="mb-1.5 block text-sm font-semibold text-foreground">
                {p.instructions}
              </label>
              <textarea
                id="indicaciones" name="indicaciones"
                value={form.indicaciones} onChange={handleChange}
                rows={3} placeholder={p.instructionsPlaceholder}
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </fieldset>

        {/* Date & Submit */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-48">
            <label htmlFor="fecha" className="mb-1.5 block text-sm font-semibold text-foreground">
              {p.date}
            </label>
            <input
              type="date" id="fecha" name="fecha"
              value={form.fecha} onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid || generating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            {generating ? p.generating : p.generate}
          </button>
        </div>

        <p className="text-xs text-muted">{p.required}</p>
      </form>

      <Disclaimer className="mt-8" />

      <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted">
        {p.privacy}{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">
          {t.common.legalNotice}
        </Link>
      </div>
    </div>
  );
}
