"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";

interface ExpertRequestCardProps {
  existingRequest: { status: RequestStatus } | null;
  role: "USUARIO" | "EXPERTO" | "ADMIN";
}

const STATUS_CONFIG: Record<RequestStatus, { label: string; description: string; color: string; bg: string; border: string }> = {
  PENDING: {
    label: "Solicitud pendiente",
    description: "Tu solicitud está siendo revisada por el equipo de ShareMyPrompt.",
    color: "#E2950F",
    bg: "rgba(226,149,15,0.08)",
    border: "rgba(226,149,15,0.25)",
  },
  APPROVED: {
    label: "¡Solicitud aprobada!",
    description: "Ya eres Experto en ShareMyPrompt. Puedes empezar a subir activos.",
    color: "#24C65F",
    bg: "rgba(36,198,95,0.08)",
    border: "rgba(36,198,95,0.25)",
  },
  REJECTED: {
    label: "Solicitud rechazada",
    description: "Tu solicitud no fue aprobada. Puedes enviar una nueva solicitud.",
    color: "#E25555",
    bg: "rgba(226,85,85,0.08)",
    border: "rgba(226,85,85,0.25)",
  },
  REVOKED: {
    label: "Acceso revocado",
    description: "Tu acceso como Experto fue revocado por el equipo de ShareMyPrompt. Puedes enviar una nueva solicitud.",
    color: "rgba(242,242,242,0.4)",
    bg: "rgba(242,242,242,0.04)",
    border: "rgba(242,242,242,0.12)",
  },
};

export function ExpertRequestCard({ existingRequest, role }: ExpertRequestCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // El rol en DB es la fuente de verdad: si el usuario ya es EXPERTO, no mostrar nada.
  // (El componente solo se renderiza para role === "USUARIO" desde DashboardRightPanel)
  if (role !== "USUARIO") return null;

  const currentStatus = existingRequest?.status ?? null;

  // PENDING: mostrar estado, sin botón de re-solicitar
  const canReapply = currentStatus === "REJECTED" || currentStatus === "REVOKED" || !currentStatus;
  const showStatus = currentStatus && !submitted;

  async function handleRequest() {
    setError("");
    setLoading(true);
    const res = await fetch("/api/expert-request", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }
    setSubmitted(true);
    router.refresh();
  }

  return (
    <section
      className="flex flex-col gap-3 p-4 rounded-lg"
      style={{ background: "rgba(98,60,234,0.06)", border: "1px solid rgba(98,60,234,0.2)" }}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#A5A0AC" }}>
        Conviértete en Experto
      </p>

      {/* Estado actual */}
      {showStatus && (
        <div
          className="flex flex-col gap-1 p-3 rounded-lg"
          style={{
            background: STATUS_CONFIG[currentStatus].bg,
            border: `1px solid ${STATUS_CONFIG[currentStatus].border}`,
          }}
        >
          <p className="text-[13px] font-medium" style={{ color: STATUS_CONFIG[currentStatus].color }}>
            {STATUS_CONFIG[currentStatus].label}
          </p>
          <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(242,242,242,0.5)" }}>
            {STATUS_CONFIG[currentStatus].description}
          </p>
        </div>
      )}

      {/* Confirmación tras enviar */}
      {submitted && (
        <div
          className="flex flex-col gap-1 p-3 rounded-lg"
          style={{ background: "rgba(36,198,95,0.08)", border: "1px solid rgba(36,198,95,0.25)" }}
        >
          <p className="text-[13px] font-medium" style={{ color: "#24C65F" }}>
            ¡Solicitud enviada!
          </p>
          <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(242,242,242,0.5)" }}>
            El equipo revisará tu solicitud pronto.
          </p>
        </div>
      )}

      {/* Botón de solicitud — solo si puede re-solicitar y no acaba de enviar */}
      {canReapply && !submitted && (
        <>
          {!currentStatus && (
            <p className="text-[12px] leading-[1.6]" style={{ color: "rgba(242,242,242,0.5)" }}>
              Solicita acceso para publicar y vender tus activos de IA en el marketplace.
            </p>
          )}
          {error && <p className="text-[12px] text-red-400">{error}</p>}
          <button
            onClick={handleRequest}
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 text-white font-bold text-[13px] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 rounded-pill"
            style={{
              background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
              boxShadow: "0px 0px 14px rgba(98,60,234,0.25)",
            }}
          >
            {loading
              ? "Enviando..."
              : currentStatus === "REJECTED" || currentStatus === "REVOKED"
                ? "Solicitar de nuevo"
                : "Solicitar ser Experto"}
          </button>
        </>
      )}
    </section>
  );
}
