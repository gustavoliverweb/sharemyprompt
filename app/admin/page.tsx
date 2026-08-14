import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_NAV } from "@/lib/admin-nav";

export const metadata = { title: "Panel de administración — Admin" };

export default async function AdminHomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/403");

  const [pendingRequests, pendingAssets, totalUsers] = await Promise.all([
    prisma.expertRequest.count({ where: { status: "PENDING" } }),
    prisma.asset.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.user.count(),
  ]);

  const cards = [
    {
      href: "/admin/expert-requests",
      label: "Solicitudes de Experto pendientes",
      value: pendingRequests,
      highlight: pendingRequests > 0,
    },
    {
      href: "/admin/assets",
      label: "Activos pendientes de revisión",
      value: pendingAssets,
      highlight: pendingAssets > 0,
    },
    {
      href: "/admin/users",
      label: "Usuarios registrados",
      value: totalUsers,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="text-[12px] uppercase tracking-widest font-bold mb-1" style={{ color: "#623CEA" }}>
            Panel de administración
          </p>
          <h1 className="text-[32px] font-bold text-white">Resumen</h1>
          <p className="text-[14px] mt-1" style={{ color: "rgba(242,242,242,0.45)" }}>
            Estado general de la operación
          </p>
        </div>

        {/* Nav */}
        <nav className="flex gap-2">
          {ADMIN_NAV.map(({ href, label }) => {
            const active = href === "/admin";
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

        {/* Cards de estado */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="flex flex-col gap-2 p-6 rounded-xl transition-colors hover:bg-white/[0.04]"
              style={{
                border: c.highlight ? "1px solid rgba(98,60,234,0.4)" : "1px solid rgba(242,242,242,0.08)",
                background: c.highlight ? "rgba(98,60,234,0.08)" : "transparent",
              }}
            >
              <span className="text-[36px] font-bold text-white">{c.value}</span>
              <span className="text-[13px]" style={{ color: "rgba(242,242,242,0.5)" }}>
                {c.label}
              </span>
            </Link>
          ))}
        </div>

        {pendingRequests === 0 && pendingAssets === 0 && (
          <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.35)" }}>
            No hay nada pendiente de revisión en este momento.
          </p>
        )}
      </div>
    </div>
  );
}
