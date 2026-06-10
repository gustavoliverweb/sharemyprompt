import Image from "next/image";
import Link from "next/link";

export type AssetType = "prompt" | "automatización" | "agente";

export interface AcquiredAssetCardProps {
  title: string;
  slug: string;
  type: AssetType;
  model: string;
  description: string;
  coverImage?: string | null;
}

const BANNER_GRADIENTS: Record<AssetType, string> = {
  prompt:
    "linear-gradient(135deg, rgba(98,60,234,0.85) 0%, rgba(55,34,132,0.95) 100%)",
  automatización:
    "linear-gradient(135deg, rgba(14,165,233,0.85) 0%, rgba(12,74,110,0.95) 100%)",
  agente:
    "linear-gradient(135deg, rgba(16,185,129,0.85) 0%, rgba(6,78,59,0.95) 100%)",
};

function ConsoleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function BrainIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

const ASSET_ICONS: Record<AssetType, React.ReactNode> = {
  prompt: <ConsoleIcon />,
  automatización: <SettingsIcon />,
  agente: <BrainIcon />,
};

const ICON_COLORS: Record<AssetType, string> = {
  prompt: "rgba(98,60,234,0.2)",
  automatización: "rgba(14,165,233,0.2)",
  agente: "rgba(16,185,129,0.2)",
};

export function AcquiredAssetCard({
  title,
  slug,
  type,
  model,
  description,
  coverImage,
}: AcquiredAssetCardProps) {
  const bannerGradient = BANNER_GRADIENTS[type] ?? BANNER_GRADIENTS.prompt;

  return (
    <article
      className="flex flex-col md:flex-row overflow-hidden"
      style={{
        background: "rgba(242,242,242,0.08)",
        borderRadius: "16px",
        border: "1px solid rgba(242,242,242,0.06)",
      }}
    >
      {/* Banner */}
      <div className="h-[180px] w-full md:h-[200px] md:w-[300px] relative shrink-0 hidden xl:block">
        {coverImage ? (
          <Image src={coverImage} alt={title} fill style={{ objectFit: "cover" }} />
        ) : (
          <div className="absolute inset-0" style={{ background: bannerGradient }} />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-4 p-5 w-full">
        {/* Icon + Title */}
        <div>
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
              style={{
                background: ICON_COLORS[type],
                color: "rgba(242,242,242,0.85)",
              }}
            >
              {ASSET_ICONS[type]}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-white font-bold text-[17px] leading-tight wrap-break-words">
                {title}
              </p>
              <p
                className="text-[12px] font-medium uppercase"
                style={{ color: "rgba(242,242,242,0.4)" }}
              >
                Type: {type}
              </p>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-[13px] leading-[1.55]"
            style={{ color: "rgba(242,242,242,0.85)" }}
          >
            {description}
          </p>

          {/* Model */}
          <p className="text-[12px]" style={{ color: "rgba(242,242,242,0.5)" }}>
            Modelo: {model}
          </p>
        </div>

        {/* Ver activo */}
        <Link
          href={`/p/${slug}`}
          className="flex items-center justify-center gap-2 py-2.5 px-5 text-white text-[14px] font-bold transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #623CEA 0%, #372284 100%)",
            borderRadius: "100px",
            boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.15)",
          }}
        >
          <PlayIcon />
          Ver activo
        </Link>
      </div>
    </article>
  );
}
