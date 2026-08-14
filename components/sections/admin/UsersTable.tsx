"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "EXPERTO" | "USUARIO";

interface UserRow {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: Role;
  createdAt: Date;
}

interface LatestChange {
  fromRole: Role;
  toRole: Role;
  changedByUsername: string;
  createdAt: Date;
}

const ROLE_LABEL: Record<Role, { label: string; color: string }> = {
  ADMIN:   { label: "Admin",   color: "#623CEA" },
  EXPERTO: { label: "Experto", color: "#24C65F" },
  USUARIO: { label: "Usuario", color: "rgba(242,242,242,0.5)" },
};

const ROLES: Role[] = ["USUARIO", "EXPERTO", "ADMIN"];

export function UsersTable({
  users,
  currentUserId,
  latestChanges,
}: {
  users: UserRow[];
  currentUserId: string;
  latestChanges: Record<string, LatestChange>;
}) {
  const [localUsers, setLocalUsers] = useState(users);
  const [pendingRole, setPendingRole] = useState<Record<string, Role>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<Record<string, string>>({});
  const router = useRouter();

  async function handleSave(userId: string) {
    const role = pendingRole[userId];
    if (!role) return;

    setLoading(userId);
    setError((prev) => ({ ...prev, [userId]: "" }));

    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    setLoading(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError((prev) => ({ ...prev, [userId]: data.error ?? "No se pudo cambiar el rol" }));
      return;
    }

    setLocalUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
    setPendingRole((prev) => {
      const next = { ...prev };
      delete next[userId];
      return next;
    });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {localUsers.map((u) => {
        const isSelf = u.id === currentUserId;
        const selected = pendingRole[u.id] ?? u.role;
        const hasChange = selected !== u.role;
        const isLoading = loading === u.id;
        const lastChange = latestChanges[u.id];
        const { label, color } = ROLE_LABEL[u.role];

        return (
          <div
            key={u.id}
            className="flex flex-col gap-3 p-4 rounded-xl"
            style={{ background: "rgba(242,242,242,0.04)", border: "1px solid rgba(242,242,242,0.08)" }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* User info */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-[15px] font-semibold text-white">
                  {u.name ?? u.username}
                  <span className="text-[13px] font-normal ml-2" style={{ color: "rgba(242,242,242,0.4)" }}>
                    @{u.username}
                  </span>
                </p>
                <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.45)" }}>
                  {u.email}
                </p>
                {lastChange && (
                  <p className="text-[11px] mt-1" style={{ color: "rgba(242,242,242,0.3)" }}>
                    Último cambio: {ROLE_LABEL[lastChange.fromRole].label} → {ROLE_LABEL[lastChange.toRole].label}
                    {" "}por @{lastChange.changedByUsername} el{" "}
                    {new Date(lastChange.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Rol actual + control de cambio */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-full"
                  style={{ color, border: `1px solid ${color}55` }}
                >
                  {label}
                </span>

                {isSelf ? (
                  <span className="text-[12px]" style={{ color: "rgba(242,242,242,0.3)" }}>
                    No puedes cambiar tu propio rol
                  </span>
                ) : (
                  <>
                    <select
                      value={selected}
                      onChange={(e) =>
                        setPendingRole((prev) => ({ ...prev, [u.id]: e.target.value as Role }))
                      }
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-lg text-[13px] bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-primary/50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="bg-surface">
                          {ROLE_LABEL[r].label}
                        </option>
                      ))}
                    </select>
                    {hasChange && (
                      <button
                        onClick={() => handleSave(u.id)}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-pill text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ background: "linear-gradient(180deg, #623cea 0%, #372284 94%)" }}
                      >
                        {isLoading ? "..." : "Guardar"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {error[u.id] && (
              <p className="text-[12px]" style={{ color: "#E25555" }}>
                {error[u.id]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
