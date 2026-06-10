import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExpertRequestsTable } from "@/components/sections/admin/ExpertRequestsTable";

const NAV = [
  { href: "/admin/expert-requests", label: "Solicitudes de Experto" },
  { href: "/admin/assets",          label: "Activos en Revisión"    },
  { href: "/admin/analytics",       label: "Analytics"              },
];

export const metadata = { title: "Solicitudes de Experto — Admin" };

export default async function AdminExpertRequestsPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/");

  const requests = await prisma.expertRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, username: true } },
    },
  });

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <p className="text-[12px] uppercase tracking-widest font-bold mb-1" style={{ color: "#623CEA" }}>
            Panel de administración
          </p>
          <h1 className="text-[32px] font-bold text-white">
            Solicitudes de Experto
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "rgba(242,242,242,0.45)" }}>
            {requests.filter((r) => r.status === "PENDING").length} solicitudes pendientes
          </p>
        </div>

        {/* Nav */}
        <nav className="flex gap-2">
          {NAV.map(({ href, label }) => {
            const active = href === "/admin/expert-requests";
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

        <ExpertRequestsTable requests={requests} />
      </div>
    </div>
  );
}
