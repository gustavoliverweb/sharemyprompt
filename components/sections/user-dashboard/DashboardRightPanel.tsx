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

function TicketRow({ id, status }: { id: string; status: "pendiente" | "resuelto" }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-[13px] font-medium uppercase" style={{ color: "#623CEA" }}>
        {id}
      </span>
      <span
        className="text-[12px] font-medium uppercase"
        style={{ color: status === "resuelto" ? "#24C65F" : "rgba(242,242,242,0.4)" }}
      >
        {status}
      </span>
    </div>
  );
}

export function DashboardRightPanel({ role, expertRequest, assets = [] }: DashboardRightPanelProps) {
  return (
    <div className="w-full md:w-[300px] md:shrink-0 flex flex-col gap-5">

      {/* Solicitud de Experto — solo para USUARIO */}
      {role === "USUARIO" && (
        <ExpertRequestCard existingRequest={expertRequest} role={role} />
      )}

      {/* Mis activos — solo para EXPERTO */}
      {(role === "EXPERTO" || role === "ADMIN") && (
        <ExpertAssetsPanel assets={assets} />
      )}

      {/* Alerts */}
      <section
        className="flex flex-col gap-3 p-4 rounded-lg"
        style={{ border: "1px solid rgba(242,242,242,0.15)" }}
      >
        <p
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#A5A0AC" }}
        >
          Alertas
        </p>

        <div
          className="flex flex-col gap-2 p-3 rounded-lg"
          style={{
            background: "rgba(226,149,15,0.1)",
            border: "1px solid rgba(226,149,15,0.3)",
          }}
        >
          <p className="text-[13px] font-medium" style={{ color: "#E2950F" }}>
            Crítica: Activo obsoleto
          </p>
          <p className="text-[12px] leading-[1.55]" style={{ color: "rgba(242,242,242,0.5)" }}>
            Advertencia de obsolescencia: Legacy prompt &quot;GRID_V1&quot;. Acción requerida
          </p>
        </div>
      </section>

      {/* Support */}
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

        <TicketRow id="Ticket-003" status="pendiente" />
        <div className="h-px" style={{ background: "rgba(242,242,242,0.08)" }} />
        <TicketRow id="Ticket-002" status="resuelto" />

        <button
          className="w-full flex items-center justify-center py-3 text-white font-bold text-[13px] mt-2 transition-colors hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "#464853",
            border: "1px solid rgba(242,242,242,0.3)",
            borderRadius: "100px",
          }}
        >
          Nuevo ticket
        </button>
      </section>

    </div>
  );
}
