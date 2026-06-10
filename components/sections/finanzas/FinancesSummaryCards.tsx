interface FinancesSummaryCardsProps {
  totalRevenue: number;
  totalSales: number;
  publishedCount: number;
  avgRating: number | null;
}

function StatCard({
  label,
  value,
  sub,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 p-5 rounded-xl"
      style={{ border: "1px solid rgba(242,242,242,0.1)", background: "rgba(242,242,242,0.03)" }}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#A5A0AC" }}>
        {label}
      </p>
      <p
        className="text-[28px] md:text-[32px] font-bold leading-none"
        style={{ color: valueColor ?? "white" }}
      >
        {value}
      </p>
      <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.4)" }}>
        {sub}
      </p>
    </div>
  );
}

export function FinancesSummaryCards({
  totalRevenue,
  totalSales,
  publishedCount,
  avgRating,
}: FinancesSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Ingresos totales"
        value={`$${totalRevenue.toFixed(2)}`}
        sub="USD"
        valueColor="#24C65F"
      />
      <StatCard
        label="Ventas totales"
        value={String(totalSales)}
        sub={totalSales === 1 ? "compra" : "compras"}
      />
      <StatCard
        label="Activos publicados"
        value={String(publishedCount)}
        sub={publishedCount === 1 ? "activo" : "activos"}
      />
      <StatCard
        label="Rating promedio"
        value={avgRating !== null ? avgRating.toFixed(1) : "—"}
        sub={avgRating !== null ? "sobre 5" : "sin reseñas"}
      />
    </div>
  );
}
