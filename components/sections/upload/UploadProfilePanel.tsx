const STATS = [
  { label: "Ventas", value: "—" },
  { label: "Balance Disponible", value: "—" },
  { label: "Ventas por validar", value: "—" },
  { label: "Próximas Ordenes", value: "—" },
  { label: "Ingresos Globales", value: "—" },
];

interface UploadProfilePanelProps {
  username: string;
  initials: string;
}

export function UploadProfilePanel({ username, initials }: UploadProfilePanelProps) {
  return (
    <div className="w-full md:w-[272px] md:shrink-0 flex flex-col gap-3 pt-0 md:pt-[120px]">
      {/* Profile + stats card */}
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Avatar + username */}
        <div className="flex flex-col items-center gap-2.5 pb-4 border-b border-white/[0.06]">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #623cea 0%, #372284 100%)",
            }}
          >
            {initials}
          </div>
          <p className="text-white font-semibold text-sm">@{username}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2.5">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[11px] text-foreground/45 uppercase tracking-wide leading-tight">
                {label}
              </span>
              <span className="text-[13px] text-white font-medium shrink-0">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Solicitar retiro — deshabilitado hasta que exista backend de payouts */}
        <button
          disabled
          title="Próximamente"
          className="w-full py-2.5 rounded-pill text-sm font-semibold text-white/50 cursor-not-allowed mt-1"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          Solicitar retiro (próximamente)
        </button>
      </div>
    </div>
  );
}
