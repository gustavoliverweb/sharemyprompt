import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AssetReviewTable } from "@/components/sections/admin/AssetReviewTable";

export const metadata = { title: "Revisión de Activos — Admin" };

const NAV = [
  { href: "/admin/expert-requests", label: "Solicitudes de Experto" },
  { href: "/admin/assets",          label: "Activos en Revisión"    },
  { href: "/admin/analytics",       label: "Analytics"              },
];

export default async function AdminAssetsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const assets = await prisma.asset.findMany({
    where: { status: "PENDING_REVIEW" },
    orderBy: { updatedAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true, username: true } },
    },
  });

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="text-[12px] uppercase tracking-widest font-bold mb-1" style={{ color: "#623CEA" }}>
            Panel de administración
          </p>
          <h1 className="text-[32px] font-bold text-white">Activos en Revisión</h1>
          <p className="text-[14px] mt-1" style={{ color: "rgba(242,242,242,0.45)" }}>
            {assets.length} activo{assets.length !== 1 ? "s" : ""} pendiente{assets.length !== 1 ? "s" : ""} de aprobación
          </p>
        </div>

        {/* Nav */}
        <nav className="flex gap-2">
          {NAV.map(({ href, label }) => {
            const active = href === "/admin/assets";
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

        <AssetReviewTable assets={assets} />
      </div>
    </div>
  );
}
