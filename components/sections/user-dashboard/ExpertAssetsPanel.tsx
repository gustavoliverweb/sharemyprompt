"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AssetStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "DISCONTINUED";
type AssetType   = "PROMPT" | "FLUJO" | "AGENTE";

interface Asset {
  id: string;
  title: string;
  type: AssetType;
  status: AssetStatus;
  rejectionReason: string | null;
  updatedAt: Date;
}

const STATUS_META: Record<AssetStatus, { label: string; color: string }> = {
  DRAFT:          { label: "Borrador",             color: "rgba(242,242,242,0.4)" },
  PENDING_REVIEW: { label: "En revisión",          color: "#E2950F"               },
  PUBLISHED:      { label: "Publicado",            color: "#24C65F"               },
  REJECTED:       { label: "Rechazado",            color: "#E25555"               },
  DISCONTINUED:   { label: "Descatalogado",        color: "rgba(242,242,242,0.3)" },
};

const TYPE_LABEL: Record<AssetType, string> = {
  PROMPT: "Prompt",
  FLUJO:  "Flujo",
  AGENTE: "Agente",
};

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function ExpertAssetsPanel({ assets: initial }: { assets: Asset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDiscontinue(id: string) {
    setLoading(id);
    const res = await fetch(`/api/assets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "discontinue" }),
    });
    setLoading(null);
    if (res.ok) {
      setAssets((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "DISCONTINUED" as const } : a))
      );
      router.refresh();
    }
  }

  return (
    <section
      className="flex flex-col gap-3 p-4 rounded-lg"
      style={{ border: "1px solid rgba(242,242,242,0.15)" }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#A5A0AC" }}>
          Mis activos
        </p>
        <Link
          href="/upload-active"
          className="flex items-center gap-1 text-[12px] font-medium transition-colors hover:opacity-80"
          style={{ color: "#623CEA" }}
        >
          <PlusIcon />
          Nuevo
        </Link>
      </div>

      {assets.length === 0 ? (
        <p className="text-[13px] py-2" style={{ color: "rgba(242,242,242,0.35)" }}>
          Aún no has publicado activos.{" "}
          <Link href="/upload-active" className="underline" style={{ color: "#623CEA" }}>
            Crear uno
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {assets.map((asset) => {
            const { label: statusLabel, color: statusColor } = STATUS_META[asset.status];
            const isLoading = loading === asset.id;

            return (
              <div key={asset.id} className="flex flex-col gap-1.5 py-2" style={{ borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{asset.title}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(242,242,242,0.35)" }}>
                      {TYPE_LABEL[asset.type]}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold uppercase shrink-0" style={{ color: statusColor }}>
                    {statusLabel}
                  </span>
                </div>

                {/* Rejection reason */}
                {asset.status === "REJECTED" && asset.rejectionReason && (
                  <p
                    className="text-[12px] leading-relaxed px-2 py-1.5 rounded"
                    style={{ background: "rgba(226,85,85,0.08)", color: "rgba(226,85,85,0.8)" }}
                  >
                    {asset.rejectionReason}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-0.5 flex-wrap">
                  {(asset.status === "DRAFT" || asset.status === "PUBLISHED") && (
                    <Link
                      href={`/upload-active/${asset.id}`}
                      className="text-[12px] px-3 py-1 rounded-pill transition-colors hover:opacity-80"
                      style={{ color: "rgba(242,242,242,0.55)", border: "1px solid rgba(242,242,242,0.12)" }}
                    >
                      Editar
                    </Link>
                  )}
                  {asset.status === "PUBLISHED" && (
                    <button
                      onClick={() => handleDiscontinue(asset.id)}
                      disabled={isLoading}
                      className="text-[12px] px-3 py-1 rounded-pill transition-colors hover:opacity-80 disabled:opacity-40"
                      style={{ color: "rgba(242,242,242,0.4)", border: "1px solid rgba(242,242,242,0.12)" }}
                    >
                      {isLoading ? "..." : "Descatalogar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
