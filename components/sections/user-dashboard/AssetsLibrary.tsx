import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AcquiredAssetCard } from "./AcquiredAssetCard";

const TYPE_MAP: Record<string, "prompt" | "automatización" | "agente"> = {
  PROMPT: "prompt",
  FLUJO:  "automatización",
  AGENTE: "agente",
};

function ShoppingBagIcon() {
  return (
    <svg
      width="48" height="48" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden style={{ color: "rgba(98,60,234,0.5)" }}
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export async function AssetsLibrary() {
  const session = await auth();
  if (!session?.user) return null;

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      asset: {
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          description: true,
          recommendedModel: true,
          coverImage: true,
        },
      },
    },
  });

  return (
    <div className="flex-1 flex flex-col gap-6 min-w-0 max-w-[1000px]">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-white">Mi biblioteca</h2>
        <span
          className="text-[12px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: "rgba(242,242,242,0.06)", color: "rgba(242,242,242,0.4)" }}
        >
          {purchases.length} {purchases.length === 1 ? "activo" : "activos"}
        </span>
      </div>

      {purchases.length === 0 ? (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center gap-6 py-16 px-8 rounded-2xl text-center"
          style={{ background: "rgba(242,242,242,0.03)", border: "1px dashed rgba(242,242,242,0.1)" }}
        >
          <div
            className="w-20 h-20 flex items-center justify-center rounded-2xl"
            style={{
              background: "rgba(98,60,234,0.08)",
              border: "1px solid rgba(98,60,234,0.2)",
              boxShadow: "0 0 30px rgba(98,60,234,0.1)",
            }}
          >
            <ShoppingBagIcon />
          </div>

          <div className="flex flex-col gap-2 max-w-[340px]">
            <p className="text-[18px] font-semibold text-white">Tu biblioteca está vacía</p>
            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(242,242,242,0.45)" }}>
              Aún no has adquirido ningún activo. Explora el marketplace y encuentra prompts, flujos y agentes creados por expertos.
            </p>
          </div>

          <Link
            href="/explorer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-pill text-[15px] font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)",
              boxShadow: "0 0 20px rgba(98,60,234,0.3)",
            }}
          >
            Explorar marketplace
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {purchases.map(({ asset }) => (
            <AcquiredAssetCard
              key={asset.id}
              title={asset.title}
              slug={asset.slug}
              type={TYPE_MAP[asset.type] ?? "prompt"}
              model={asset.recommendedModel ?? "—"}
              description={asset.description ?? ""}
              coverImage={asset.coverImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
