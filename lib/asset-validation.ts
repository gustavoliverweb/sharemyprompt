// architecture.md exige un mínimo de 100 caracteres por bloque para los
// pilares en texto libre antes de poder enviar un activo a revisión.
export const MIN_PILLAR_LENGTH = 100;

const PILLARS = [
  { field: "roleDefinition", label: "Definición de rol" },
  { field: "contentScope", label: "Delimitación de contenido" },
  { field: "taskDefinition", label: "Definición de tarea" },
] as const;

export function validatePillarsForReview(data: {
  roleDefinition?: string | null;
  contentScope?: string | null;
  taskDefinition?: string | null;
}): string[] {
  return PILLARS.filter(
    ({ field }) => (data[field]?.trim().length ?? 0) < MIN_PILLAR_LENGTH
  ).map(({ label }) => `${label} debe tener al menos ${MIN_PILLAR_LENGTH} caracteres`);
}
