"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";

interface Request {
  id: string;
  status: RequestStatus;
  message: string | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string;
  };
}

const STATUS_LABEL: Record<RequestStatus, { label: string; color: string }> = {
  PENDING:  { label: "Pendiente", color: "#E2950F" },
  APPROVED: { label: "Aprobada",  color: "#24C65F" },
  REJECTED: { label: "Rechazada", color: "#E25555" },
  REVOKED:  { label: "Revocada",  color: "rgba(242,242,242,0.35)" },
};

export function ExpertRequestsTable({ requests }: { requests: Request[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [localRequests, setLocalRequests] = useState(requests);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const router = useRouter();

  async function handleAction(id: string, action: "approve" | "reject" | "revoke") {
    setLoading(id);
    const res = await fetch(`/api/admin/expert-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(null);
    setConfirmRevoke(null);

    if (res.ok) {
      const statusMap = { approve: "APPROVED", reject: "REJECTED", revoke: "REVOKED" } as const;
      setLocalRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: statusMap[action] } : r))
      );
      router.refresh();
    }
  }

  if (localRequests.length === 0) {
    return (
      <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.35)" }}>
        No hay solicitudes registradas.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {localRequests.map((req) => {
        const { label, color } = STATUS_LABEL[req.status];
        const isPending   = req.status === "PENDING";
        const isApproved  = req.status === "APPROVED";
        const isRevoking  = confirmRevoke === req.id;
        const isLoading   = loading === req.id;

        return (
          <div
            key={req.id}
            className="flex flex-col gap-3 p-4 rounded-xl"
            style={{
              background: "rgba(242,242,242,0.04)",
              border: "1px solid rgba(242,242,242,0.08)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* User info */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-[15px] font-semibold text-white">
                  {req.user.name ?? req.user.username}
                  <span className="text-[13px] font-normal ml-2" style={{ color: "rgba(242,242,242,0.4)" }}>
                    @{req.user.username}
                  </span>
                </p>
                <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.45)" }}>
                  {req.user.email}
                </p>
                {req.message && (
                  <p className="text-[12px] mt-1 leading-[1.5]" style={{ color: "rgba(242,242,242,0.55)" }}>
                    &quot;{req.message}&quot;
                  </p>
                )}
                <p className="text-[11px] mt-1" style={{ color: "rgba(242,242,242,0.3)" }}>
                  {new Date(req.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </p>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[12px] font-bold uppercase" style={{ color }}>
                  {label}
                </span>

                {isPending && (
                  <>
                    <button
                      onClick={() => handleAction(req.id, "approve")}
                      disabled={isLoading}
                      className="px-4 py-1.5 rounded-pill text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "linear-gradient(180deg, #623cea 0%, #372284 94%)" }}
                    >
                      {isLoading ? "..." : "Aprobar"}
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      disabled={isLoading}
                      className="px-4 py-1.5 rounded-pill text-[13px] font-bold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ color: "#E25555", border: "1px solid rgba(226,85,85,0.35)" }}
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {isApproved && !isRevoking && (
                  <button
                    onClick={() => setConfirmRevoke(req.id)}
                    disabled={isLoading}
                    className="px-4 py-1.5 rounded-pill text-[13px] font-medium transition-all hover:opacity-80 disabled:opacity-50"
                    style={{ color: "rgba(242,242,242,0.45)", border: "1px solid rgba(242,242,242,0.15)" }}
                  >
                    Revocar
                  </button>
                )}
              </div>
            </div>

            {/* Confirmación de revocación */}
            {isRevoking && (
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg"
                style={{ background: "rgba(226,85,85,0.08)", border: "1px solid rgba(226,85,85,0.2)" }}
              >
                <p className="text-[13px] flex-1" style={{ color: "rgba(242,242,242,0.7)" }}>
                  Esto degradará al usuario a <strong>USUARIO</strong> y eliminará su acceso para publicar activos.
                </p>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAction(req.id, "revoke")}
                    disabled={isLoading}
                    className="px-4 py-1.5 rounded-pill text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                    style={{ background: "#c03030" }}
                  >
                    {isLoading ? "..." : "Confirmar"}
                  </button>
                  <button
                    onClick={() => setConfirmRevoke(null)}
                    className="px-4 py-1.5 rounded-pill text-[13px] transition-colors"
                    style={{ color: "rgba(242,242,242,0.45)" }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
