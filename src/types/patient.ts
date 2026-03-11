export type Species = "perro" | "gato" | "otro";
export type Sex = "macho" | "hembra" | "";

export interface Patient {
  id: string;
  user_id: string;
  name: string;
  species: Species;
  breed: string | null;
  sex: Sex | null;
  neutered: boolean;
  birth_date: string | null; // ISO date 'YYYY-MM-DD'
  weight_kg: number | null;
  color: string | null;
  microchip: string | null;
  owner_name: string;
  owner_phone: string | null;
  owner_email: string | null;
  owner_address: string | null;
  allergies: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  name: string;
  species: Species;
  breed: string;
  sex: Sex;
  neutered: boolean;
  birth_date: string;
  weight_kg: string; // string for <input>, converted on submit
  color: string;
  microchip: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  owner_address: string;
  allergies: string;
  notes: string;
}

export const emptyPatientForm: PatientFormData = {
  name: "",
  species: "perro",
  breed: "",
  sex: "",
  neutered: false,
  birth_date: "",
  weight_kg: "",
  color: "",
  microchip: "",
  owner_name: "",
  owner_phone: "",
  owner_email: "",
  owner_address: "",
  allergies: "",
  notes: "",
};

export function calcAge(birthDate: string): { years: number; months: number; days: number } {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  return { years, months, days };
}

export function formatAge(birthDate: string): string {
  const { years, months, days } = calcAge(birthDate);
  if (years > 0) return `${years} año${years !== 1 ? "s" : ""}`;
  if (months > 0) return `${months} mes${months !== 1 ? "es" : ""}`;
  return `${days} día${days !== 1 ? "s" : ""}`;
}
