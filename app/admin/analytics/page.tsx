import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Analytics — Admin" };

const NAV = [
  { href: "/admin/expert-requests", label: "Solicitudes de Experto" },
  { href: "/admin/assets",          label: "Activos en Revisión"    },
  { href: "/admin/analytics",       label: "Analytics"              },
];

const TYPE_LABEL: Record<string, string> = {
  PROMPT: "Prompt",
  FLUJO:  "Flujo",
  AGENTE: "Agente",
};

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const [allPurchases, allAssets, userCount] = await Promise.all([
    prisma.purchase.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { title: true, type: true } },
        user:  { select: { username: true } },
      },
    }),
    prisma.asset.findMany({
      include: {
        purchases: { select: { amount: true } },
        reviews:   { select: { rating: true } },
        user:      { select: { username: true } },
      },
    }),
    prisma.user.count(),
  ]);

  const totalRevenue   = allPurchases.reduce((s, p) => s + Number(p.amount), 0);
  const totalSales     = allPurchases.length;
  const publishedCount = allAssets.filter((a) => a.status === "PUBLISHED").length;

  const topAssets = allAssets
    .map((a) => ({
      id:         a.id,
      title:      a.title,
      type:       a.type,
      username:   a.user.username,
      salesCount: a.purchases.length,
      revenue:    a.purchases.reduce((s, p) => s + Number(p.amount), 0),
      avgRating:
        a.reviews.length > 0
          ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length
          : null,
    }))
    .sort((a, b) => b.salesCount - a.salesCount || b.revenue - a.revenue)
    .slice(0, 10);

  const recentSales = allPurchases.slice(0, 8);

  const summaryCards = [
    { label: "Ingresos totales",      value: `$${totalRevenue.toFixed(2)}`, sub: "USD",                                          color: "#24C65F" },
    { label: "Ventas totales",        value: String(totalSales),            sub: totalSales === 1 ? "compra" : "compras",         color: "white"   },
    { label: "Activos publicados",    value: String(publishedCount),        sub: publishedCount === 1 ? "activo" : "activos",     color: "white"   },
    { label: "Usuarios registrados",  value: String(userCount),             sub: userCount === 1 ? "usuario" : "usuarios",        color: "white"   },
  ];

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <p className="text-[12px] uppercase tracking-widest font-bold mb-1" style={{ color: "#623CEA" }}>
            Panel de administración
          </p>
          <h1 className="text-[32px] font-bold text-white">Analytics</h1>
          <p className="text-[14px] mt-1" style={{ color: "rgba(242,242,242,0.45)" }}>
            Resumen global de la plataforma
          </p>
        </div>

        {/* Nav */}
        <nav className="flex gap-2 flex-wrap">
          {NAV.map(({ href, label }) => {
            const active = href === "/admin/analytics";
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                style={
                  active
                    ? { background: "rgba(98,60,234,0.18)", border: "1px solid rgba(98,60,234,0.35)", color: "#fff" }
                    : { color: "rgba(242,242,242,0.4)", border: "1px solid transparent" }
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map(({ label, value, sub, color }) => (
            <div
              key={label}
              className="flex flex-col gap-2 p-5 rounded-xl"
              style={{ border: "1px solid rgba(242,242,242,0.1)", background: "rgba(242,242,242,0.03)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#A5A0AC" }}>
                {label}
              </p>
              <p className="text-[28px] font-bold leading-none" style={{ color }}>
                {value}
              </p>
              <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.4)" }}>
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* Top assets */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[18px] font-semibold text-white">Activos más populares</h2>

          {topAssets.length === 0 ? (
            <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.4)" }}>
              Aún no hay ventas registradas.
            </p>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(242,242,242,0.1)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(242,242,242,0.08)", background: "rgba(242,242,242,0.03)" }}>
                    {["Activo", "Experto", "Tipo", "Ventas", "Ingresos", "Rating"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest"
                        style={{ color: "#A5A0AC" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topAssets.map((asset, i) => (
                    <tr
                      key={asset.id}
                      style={{
                        borderBottom: i < topAssets.length - 1 ? "1px solid rgba(242,242,242,0.06)" : undefined,
                        background: i % 2 === 0 ? "rgba(242,242,242,0.02)" : "transparent",
                      }}
                    >
                      <td className="px-4 py-3 text-[13px] font-medium text-white">
                        <span className="block max-w-[180px] truncate">{asset.title}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: "#623CEA" }}>
                        @{asset.username}
                      </td>
                      <td className="px-4 py-3 text-[12px]" style={{ color: "rgba(242,242,242,0.5)" }}>
                        {TYPE_LABEL[asset.type] ?? asset.type}
                      </td>
                      <td className="px-4 py-3 text-[15px] font-semibold text-white">
                        {asset.salesCount}
                      </td>
                      <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: "#24C65F" }}>
                        {asset.revenue === 0 ? "—" : `$${asset.revenue.toFixed(2)}`}
                      </td>
                      <td className="px-4 py-3 text-[13px]" style={{ color: "rgba(242,242,242,0.5)" }}>
                        {asset.avgRating !== null ? `${asset.avgRating.toFixed(1)} ⭐` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent sales */}
        {recentSales.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-[18px] font-semibold text-white">Ventas recientes</h2>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(242,242,242,0.1)" }}>
              {recentSales.map((sale, i) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between px-5 py-3.5"
                  style={{
                    borderBottom: i < recentSales.length - 1 ? "1px solid rgba(242,242,242,0.06)" : undefined,
                    background: i % 2 === 0 ? "rgba(242,242,242,0.02)" : "transparent",
                  }}
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[14px] font-medium text-white truncate">
                      {sale.asset.title}
                    </span>
                    <span className="text-[12px]" style={{ color: "rgba(242,242,242,0.4)" }}>
                      @{sale.user.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-[13px]" style={{ color: "rgba(242,242,242,0.45)" }}>
                      {sale.createdAt.toLocaleDateString("es-MX", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                    <span className="text-[14px] font-semibold" style={{ color: "#24C65F" }}>
                      {Number(sale.amount) === 0 ? "Gratis" : `$${Number(sale.amount).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
