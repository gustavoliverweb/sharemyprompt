export const ASSET_CATEGORIES = [
  { id: "marketing",  label: "Marketing & ventas"     },
  { id: "codigo",     label: "Código & desarrollo"    },
  { id: "contenido",  label: "Contenido & texto"      },
  { id: "diseno",     label: "Diseño & visión"        },
  { id: "educacion",  label: "Educación"              },
  { id: "negocios",   label: "Negocios & estrategia"  },
  { id: "datos",      label: "Datos & análisis"       },
] as const;

export type CategoryId = (typeof ASSET_CATEGORIES)[number]["id"];

export function getCategoryLabel(id: string | null | undefined): string {
  return ASSET_CATEGORIES.find((c) => c.id === id)?.label ?? "Sin categoría";
}
