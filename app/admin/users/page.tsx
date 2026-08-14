import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { UsersTable } from "@/components/sections/admin/UsersTable";

export const metadata = { title: "Usuarios — Admin" };

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/403");

  const [users, recentChanges] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
    }),
    prisma.roleChange.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { changedBy: { select: { username: true } } },
    }),
  ]);

  const latestChangeByUser = new Map<string, (typeof recentChanges)[number]>();
  for (const change of recentChanges) {
    if (!latestChangeByUser.has(change.userId)) {
      latestChangeByUser.set(change.userId, change);
    }
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="text-[12px] uppercase tracking-widest font-bold mb-1" style={{ color: "#623CEA" }}>
            Panel de administración
          </p>
          <h1 className="text-[32px] font-bold text-white">Usuarios</h1>
          <p className="text-[14px] mt-1" style={{ color: "rgba(242,242,242,0.45)" }}>
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex gap-2">
          {ADMIN_NAV.map(({ href, label }) => {
            const active = href === "/admin/users";
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

        <UsersTable
          users={users}
          currentUserId={session.user.id}
          latestChanges={Object.fromEntries(
            [...latestChangeByUser.entries()].map(([userId, c]) => [
              userId,
              {
                fromRole: c.fromRole,
                toRole: c.toRole,
                changedByUsername: c.changedBy.username,
                createdAt: c.createdAt,
              },
            ])
          )}
        />
      </div>
    </div>
  );
}
