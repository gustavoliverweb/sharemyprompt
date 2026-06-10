"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AssetStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "DISCONTINUED";
type AssetType = "PROMPT" | "FLUJO" | "AGENTE";

interface Asset {
  id: string;
  title: string;
  type: AssetType;
  status: AssetStatus;
  description: string | null;
  promptContent: string | null;
  price: number | string | { toString(): string };
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    username: string;
  };
}

const TYPE_LABEL: Record<AssetType, { label: string; color: string }> = {
  PROMPT: { label: "Prompt",    color: "#4A90D9" },
  FLUJO:  { label: "Flujo",     color: "#FF9F1C" },
  AGENTE: { label: "Agente",    color: "#8C6CF2" },
};

export function AssetReviewTable({ assets: initial }: { assets: Asset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleApprove(id: string) {
    setLoading(id);
    const res = await fetch(`/api/admin/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setLoading(null);
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    }
  }

  async function handleReject(id: string) {
    if (!reason.trim()) return;
    setLoading(id);
    const res = await fetch(`/api/admin/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", reason }),
    });
    setLoading(null);
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      setRejectingId(null);
      setReason("");
      router.refresh();
    }
  }

  if (assets.length === 0) {
    return (
      <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.35)" }}>
        No hay activos pendientes de revisión.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {assets.map((asset) => {
        const { label: typeLabel, color: typeColor } = TYPE_LABEL[asset.type];
        const isExpanded = expanded === asset.id;
        const isRejecting = rejectingId === asset.id;

        return (
          <div
            key={asset.id}
            className="flex flex-col gap-4 p-5 rounded-xl"
            style={{
              background: "rgba(242,242,242,0.04)",
              border: "1px solid rgba(242,242,242,0.08)",
            }}
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-[11px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ color: typeColor, background: `${typeColor}18` }}
                  >
                    {typeLabel}
                  </span>
                  <span
                    className="text-[11px] font-bold uppercase"
                    style={{ color: "#E2950F" }}
                  >
                    Pendiente
                  </span>
                </div>
                <p className="text-[16px] font-semibold text-white mt-1 truncate">
                  {asset.title}
                </p>
                <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.45)" }}>
                  por{" "}
                  <span className="text-white">@{asset.user.username}</span>
                  {" · "}
                  {asset.user.email}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(242,242,242,0.3)" }}>
                  {new Date(asset.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                  {" · "}
                  ${Number(asset.price).toFixed(2)} USD
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setExpanded(isExpanded ? null : asset.id)}
                  className="px-3 py-1.5 rounded-lg text-[12px] transition-colors hover:bg-white/5"
                  style={{ color: "rgba(242,242,242,0.5)", border: "1px solid rgba(242,242,242,0.1)" }}
                >
                  {isExpanded ? "Ocultar" : "Ver detalle"}
                </button>
                <button
                  onClick={() => handleApprove(asset.id)}
                  disabled={loading === asset.id}
                  className="px-4 py-1.5 rounded-pill text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(180deg, #623cea 0%, #372284 94%)" }}
                >
                  {loading === asset.id ? "..." : "Aprobar"}
                </button>
                <button
                  onClick={() => { setRejectingId(isRejecting ? null : asset.id); setReason(""); }}
                  disabled={loading === asset.id}
                  className="px-4 py-1.5 rounded-pill text-[13px] font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ color: "#E25555", border: "1px solid rgba(226,85,85,0.35)" }}
                >
                  Rechazar
                </button>
              </div>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div
                className="flex flex-col gap-3 p-4 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {asset.description && (
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "rgba(242,242,242,0.3)" }}>Descripción</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: "rgba(242,242,242,0.7)" }}>{asset.description}</p>
                  </div>
                )}
                {asset.promptContent && (
                  <div>
                    <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "rgba(242,242,242,0.3)" }}>Prompt</p>
                    <pre
                      className="text-[12px] leading-relaxed whitespace-pre-wrap break-words p-3 rounded-lg"
                      style={{ color: "rgba(242,242,242,0.65)", background: "rgba(0,0,0,0.2)" }}
                    >
                      {asset.promptContent}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Rejection form */}
            {isRejecting && (
              <div className="flex flex-col gap-3">
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explica al experto por qué se rechaza este activo..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-foreground/25 focus:outline-none resize-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(226,85,85,0.35)" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(asset.id)}
                    disabled={!reason.trim() || loading === asset.id}
                    className="px-4 py-2 rounded-pill text-[13px] font-bold text-white transition-all hover:opacity-90 disabled:opacity-40"
                    style={{ background: "#c03030" }}
                  >
                    {loading === asset.id ? "..." : "Confirmar rechazo"}
                  </button>
                  <button
                    onClick={() => { setRejectingId(null); setReason(""); }}
                    className="px-4 py-2 rounded-pill text-[13px] transition-colors"
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
