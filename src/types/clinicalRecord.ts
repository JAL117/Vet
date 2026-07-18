export interface ClinicalRecord {
  id: string;
  patient_id: string;
  user_id: string;
  date: string; // Fecha ISO 'YYYY-MM-DD'
  reason: string | null;
  weight_kg: number | null;
  temperature: number | null;
  diagnosis: string | null;
  treatment: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClinicalRecordFormData {
  date: string;
  reason: string;
  weight_kg: string; // string para <input>, se convierte al enviar
  temperature: string; // string para <input>, se convierte al enviar
  diagnosis: string;
  treatment: string;
  notes: string;
}

export const emptyClinicalRecordForm: ClinicalRecordFormData = {
  date: new Date().toISOString().split("T")[0],
  reason: "",
  weight_kg: "",
  temperature: "",
  diagnosis: "",
  treatment: "",
  notes: "",
};

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}
