import Link from "next/link";

type AssetStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "DISCONTINUED";
type AssetType   = "PROMPT" | "FLUJO" | "AGENTE";

export interface AssetRow {
  id: string;
  title: string;
  type: AssetType;
  status: AssetStatus;
  price: number;
  salesCount: number;
  revenue: number;
  avgRating: number | null;
  reviewCount: number;
}

const STATUS_META: Record<AssetStatus, { label: string; color: string }> = {
  DRAFT:          { label: "Borrador",      color: "rgba(242,242,242,0.4)" },
  PENDING_REVIEW: { label: "En revisión",   color: "#E2950F"               },
  PUBLISHED:      { label: "Publicado",     color: "#24C65F"               },
  REJECTED:       { label: "Rechazado",     color: "#E25555"               },
  DISCONTINUED:   { label: "Descatalogado", color: "rgba(242,242,242,0.3)" },
};

const TYPE_LABEL: Record<AssetType, string> = {
  PROMPT: "Prompt",
  FLUJO:  "Flujo",
  AGENTE: "Agente",
};

const TABLE_HEADERS = ["Activo", "Tipo", "Estado", "Precio", "Ventas", "Ingresos", "Rating"];

export function FinancesAssetsTable({ assets }: { assets: AssetRow[] }) {
  if (assets.length === 0) {
    return (
      <section className="flex flex-col gap-3">
        <h2 className="text-[18px] font-semibold text-white">Rendimiento por activo</h2>
        <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.4)" }}>
          Aún no tienes activos creados.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[18px] font-semibold text-white">Rendimiento por activo</h2>

      {/* Desktop table */}
      <div
        className="hidden md:block rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(242,242,242,0.1)" }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                borderBottom: "1px solid rgba(242,242,242,0.08)",
                background: "rgba(242,242,242,0.03)",
              }}
            >
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "#A5A0AC" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, i) => {
              const { label: statusLabel, color: statusColor } = STATUS_META[asset.status];
              return (
                <tr
                  key={asset.id}
                  style={{
                    borderBottom:
                      i < assets.length - 1 ? "1px solid rgba(242,242,242,0.06)" : undefined,
                    background: i % 2 === 0 ? "rgba(242,242,242,0.02)" : "transparent",
                  }}
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/upload-active/${asset.id}`}
                      className="text-[14px] font-medium text-white hover:underline block max-w-[200px] truncate"
                    >
                      {asset.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: "rgba(242,242,242,0.55)" }}>
                    {TYPE_LABEL[asset.type]}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] font-bold uppercase" style={{ color: statusColor }}>
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: "rgba(242,242,242,0.55)" }}>
                    {asset.price === 0 ? "Gratis" : `$${asset.price.toFixed(2)}`}
                  </td>
                  <td className="px-5 py-3.5 text-[15px] font-semibold text-white">
                    {asset.salesCount}
                  </td>
                  <td className="px-5 py-3.5 text-[14px] font-semibold" style={{ color: "#24C65F" }}>
                    {asset.revenue === 0 ? "—" : `$${asset.revenue.toFixed(2)}`}
                  </td>
                  <td className="px-5 py-3.5 text-[13px]" style={{ color: "rgba(242,242,242,0.55)" }}>
                    {asset.avgRating !== null
                      ? `${asset.avgRating.toFixed(1)} ⭐ (${asset.reviewCount})`
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {assets.map((asset) => {
          const { label: statusLabel, color: statusColor } = STATUS_META[asset.status];
          return (
            <div
              key={asset.id}
              className="flex flex-col gap-3 p-4 rounded-xl"
              style={{
                border: "1px solid rgba(242,242,242,0.1)",
                background: "rgba(242,242,242,0.02)",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/upload-active/${asset.id}`}
                    className="text-[14px] font-medium text-white truncate block hover:underline"
                  >
                    {asset.title}
                  </Link>
                  <p className="text-[12px] mt-0.5" style={{ color: "rgba(242,242,242,0.4)" }}>
                    {TYPE_LABEL[asset.type]}
                  </p>
                </div>
                <span className="text-[11px] font-bold uppercase shrink-0" style={{ color: statusColor }}>
                  {statusLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#A5A0AC" }}>
                    Ventas
                  </p>
                  <p className="text-[18px] font-bold text-white">{asset.salesCount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#A5A0AC" }}>
                    Ingresos
                  </p>
                  <p className="text-[15px] font-bold" style={{ color: "#24C65F" }}>
                    {asset.revenue === 0 ? "—" : `$${asset.revenue.toFixed(2)}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: "#A5A0AC" }}>
                    Rating
                  </p>
                  <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.6)" }}>
                    {asset.avgRating !== null ? `${asset.avgRating.toFixed(1)} ⭐` : "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
