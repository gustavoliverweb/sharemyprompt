import { ExpertRequestCard } from "./ExpertRequestCard";
import { ExpertAssetsPanel } from "./ExpertAssetsPanel";

type Role = "ADMIN" | "EXPERTO" | "USUARIO";
type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED";
type AssetStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "DISCONTINUED";
type AssetType   = "PROMPT" | "FLUJO" | "AGENTE";

interface ExpertAsset {
  id: string;
  title: string;
  type: AssetType;
  status: AssetStatus;
  rejectionReason: string | null;
  updatedAt: Date;
}

interface DashboardRightPanelProps {
  role: Role;
  expertRequest: { status: RequestStatus } | null;
  assets?: ExpertAsset[];
}

export function DashboardRightPanel({ role, expertRequest, assets = [] }: DashboardRightPanelProps) {
  return (
    <div className="w-full md:w-[300px] md:shrink-0 flex flex-col gap-5">

      {/* Solicitud de Experto — solo para USUARIO */}
      {role === "USUARIO" && (
        <ExpertRequestCard existingRequest={expertRequest} role={role} />
      )}

      {/* Bienvenida — solo justo después de la aprobación, antes del primer activo */}
      {role === "EXPERTO" && assets.length === 0 && expertRequest?.status === "APPROVED" && (
        <section
          className="flex flex-col gap-1 p-4 rounded-lg"
          style={{ background: "rgba(36,198,95,0.08)", border: "1px solid rgba(36,198,95,0.25)" }}
        >
          <p className="text-[13px] font-medium" style={{ color: "#24C65F" }}>
            🎉 Ya eres Experto en ShareMyPrompt
          </p>
          <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(242,242,242,0.5)" }}>
            Sube tu primer activo para empezar a vender en el marketplace.
          </p>
        </section>
      )}

      {/* Mis activos — solo para EXPERTO */}
      {(role === "EXPERTO" || role === "ADMIN") && (
        <ExpertAssetsPanel assets={assets} />
      )}

      {/* Soporte — sin backend de tickets/disputas todavía, ver /help */}
      <section
        className="flex flex-col gap-2 p-4 rounded-lg"
        style={{ background: "rgba(242,242,242,0.07)", border: "1px solid rgba(242,242,242,0.06)" }}
      >
        <p
          className="text-[11px] font-bold uppercase tracking-widest mb-1"
          style={{ color: "#A5A0AC" }}
        >
          Soporte
        </p>
        <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(242,242,242,0.5)" }}>
          ¿Necesitas ayuda? Escríbenos desde el centro de ayuda.
        </p>
        <a
          href="/help"
          className="w-full flex items-center justify-center py-3 text-white font-bold text-[13px] mt-2 transition-colors hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "#464853",
            border: "1px solid rgba(242,242,242,0.3)",
            borderRadius: "100px",
          }}
        >
          Ir a ayuda
        </a>
      </section>

    </div>
  );
}
