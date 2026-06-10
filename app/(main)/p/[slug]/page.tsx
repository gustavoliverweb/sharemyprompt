import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getCategoryLabel } from "@/lib/categories";
import { AcquireButton } from "./AcquireButton";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { ReviewSection } from "./ReviewSection";

// ── Icons ────────────────────────────────────────────────

function VerifiedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#623cea" aria-hidden>
      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="rgba(98,60,234,0.15)" />
      <path d="M8 12.5l3 3 5-6" stroke="#623cea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="6" height="11" viewBox="0 0 6 11" fill="none" aria-hidden>
      <path d="M1 1l4 4.5L1 10" stroke="rgba(242,242,242,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlowDot() {
  return (
    <span
      className="mt-1.5 w-2 h-2 rounded-full shrink-0"
      style={{ background: "#00F5FF", boxShadow: "0 0 6px rgba(0,245,255,0.6)" }}
      aria-hidden
    />
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="rgba(242,242,242,0.4)" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="rgba(242,242,242,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="rgba(242,242,242,0.4)" />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#24C65F" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" stroke="#24C65F" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="#24C65F" />
    </svg>
  );
}

// ── Constants ────────────────────────────────────────────

const TYPE_GRADIENT: Record<string, string> = {
  PROMPT: "linear-gradient(135deg, rgba(98,60,234,0.45) 0%, rgba(25,24,32,1) 100%)",
  FLUJO:  "linear-gradient(135deg, rgba(251,146,60,0.35) 0%, rgba(25,24,32,1) 100%)",
  AGENTE: "linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(25,24,32,1) 100%)",
};

const TYPE_LABEL: Record<string, string> = {
  PROMPT: "Prompt",
  FLUJO:  "Flujo",
  AGENTE: "Agente de IA",
};

const OUTPUT_FORMAT_LABEL: Record<string, string> = {
  JSON:     "JSON",
  MARKDOWN: "Markdown",
  TABLA:    "Tabla estructurada",
  CODIGO:   "Código",
};

// ── Helpers ──────────────────────────────────────────────

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

const getAsset = cache(async (slug: string) => {
  return prisma.asset.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { user: { select: { username: true, name: true } } },
  });
});

// ── Metadata ─────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const asset = await getAsset(slug);
  if (!asset) return { title: "Activo no encontrado — ShareMyPrompt" };
  return {
    title: `${asset.title} — ShareMyPrompt`,
    description: asset.description ?? undefined,
  };
}

// ── Page ──────────────────────────────────────────────────

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; purchased?: string }>;
}) {
  const [{ slug }, sp, session] = await Promise.all([params, searchParams, auth()]);
  const asset = await getAsset(slug);
  if (!asset) notFound();

  // ── Determinar si el usuario ya tiene acceso ──────────
  let hasPurchased = false;
  let purchaseJustConfirmed = false;

  if (session?.user) {
    // Caso 1: compra directa (activo gratuito o webhook ya procesado)
    const existing = await prisma.purchase.findUnique({
      where: { userId_assetId: { userId: session.user.id, assetId: asset.id } },
    });
    hasPurchased = !!existing;

    // Caso 2: volviendo de Stripe, webhook puede no haber disparado aún
    if (!hasPurchased && sp.session_id) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sp.session_id);
        if (
          stripeSession.payment_status === "paid" &&
          stripeSession.metadata?.assetId === asset.id &&
          stripeSession.metadata?.userId === session.user.id
        ) {
          await prisma.purchase.upsert({
            where: { userId_assetId: { userId: session.user.id, assetId: asset.id } },
            update: { stripeSessionId: stripeSession.id },
            create: {
              userId: session.user.id,
              assetId: asset.id,
              amount: (stripeSession.amount_total ?? 0) / 100,
              stripeSessionId: stripeSession.id,
            },
          });
          hasPurchased = true;
          purchaseJustConfirmed = true;
        }
      } catch {
        // session_id inválida o expirada — ignorar
      }
    }

    // Caso 3: redirect desde compra gratuita
    if (!hasPurchased && sp.purchased === "1") {
      hasPurchased = await prisma.purchase
        .findUnique({ where: { userId_assetId: { userId: session.user.id, assetId: asset.id } } })
        .then(Boolean);
    }

    // El autor siempre tiene acceso a su propio activo
    if (asset.userId === session.user.id) hasPurchased = true;
  }

  // ── Carrito ───────────────────────────────────────────
  let inCart = false;
  if (session?.user && !hasPurchased && asset.userId !== session.user.id) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { userId_assetId: { userId: session.user.id, assetId: asset.id } },
    });
    inCart = !!cartItem;
  }

  // ── Datos derivados ───────────────────────────────────
  const author = asset.user.name ?? `@${asset.user.username}`;
  const price = formatPrice(asset.price);
  const categoryLabel = getCategoryLabel(asset.category);
  const gradient = TYPE_GRADIENT[asset.type] ?? TYPE_GRADIENT.PROMPT;
  const outputLabel = OUTPUT_FORMAT_LABEL[asset.outputFormat] ?? asset.outputFormat;

  const previewText = asset.promptContent ? asset.promptContent.slice(0, 300) : null;

  const benefits = [
    "Calidad verificada por Sharemyprompt",
    `Formato de salida: ${outputLabel}`,
    asset.recommendedModel ? `Modelo recomendado: ${asset.recommendedModel}` : null,
    `Actualizado: ${new Date(asset.updatedAt).toLocaleDateString("es-MX", { month: "long", year: "numeric" })}`,
  ].filter(Boolean) as string[];

  const includes = [
    asset.roleDefinition   && { title: "Definición de rol:",     description: asset.roleDefinition   },
    asset.taskDefinition   && { title: "Tarea asignada:",        description: asset.taskDefinition   },
    asset.contentScope     && { title: "Alcance del contenido:", description: asset.contentScope     },
    asset.recommendedModel && { title: "Modelo recomendado:",    description: asset.recommendedModel },
    { title: "Formato de salida:", description: outputLabel },
  ].filter(Boolean) as { title: string; description: string }[];

  const isOwnAsset = session?.user?.id === asset.userId;

  return (
    <main className="pt-[114px] bg-surface min-h-screen">
      {/* ── Banner de compra confirmada ───────────────── */}
      {purchaseJustConfirmed && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl"
          style={{ background: "rgba(36,198,95,0.15)", border: "1px solid rgba(36,198,95,0.4)" }}
        >
          <UnlockIcon />
          <span className="text-[15px] font-medium text-white">¡Compra realizada! Ya tienes acceso completo.</span>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 flex-wrap" aria-label="Breadcrumb">
          <Link href="/explorer" className="text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors">Explorar</Link>
          {asset.category && (
            <>
              <ChevronIcon />
              <Link href={`/explorer?cat=${asset.category}`} className="text-[13px] font-medium text-foreground/60 hover:text-foreground transition-colors">
                {categoryLabel}
              </Link>
            </>
          )}
          <ChevronIcon />
          <span className="text-[13px] font-medium text-foreground/40 line-clamp-1 max-w-[280px]">{asset.title}</span>
        </nav>

        {/* Type badge + purchased badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded"
            style={{ background: "rgba(98,60,234,0.2)", color: "#9d7ef7", border: "1px solid rgba(98,60,234,0.3)" }}
          >
            {TYPE_LABEL[asset.type] ?? asset.type}
          </span>
          {hasPurchased && (
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded"
              style={{ background: "rgba(36,198,95,0.12)", color: "#24C65F", border: "1px solid rgba(36,198,95,0.3)" }}
            >
              <UnlockIcon />
              {isOwnAsset ? "Tu activo" : "Adquirido"}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(24px, 2.7vw, 39px)", maxWidth: "900px" }}>
          {asset.title}
        </h1>

        {/* Author */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-white">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/u/${asset.user.username}`}
              className="text-[16px] transition-opacity hover:opacity-70"
            >
              Por {author}
            </Link>
            <VerifiedIcon />
          </div>
        </div>

        {/* Image + License card */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Cover image */}
          <div className="flex-1 relative min-w-0 w-full rounded-xl overflow-hidden" style={{ aspectRatio: "832 / 455" }}>
            {asset.coverImage && (
              <Image src={asset.coverImage} alt={asset.title} fill className="object-cover z-10" sizes="(max-width: 1024px) 100vw, 60vw" priority />
            )}
            <div className="absolute inset-0" style={{ background: gradient }} aria-hidden />
          </div>

          {/* License card */}
          <div className="w-full lg:w-[430px] xl:w-[520px] shrink-0 flex flex-col gap-3">
            <div
              className="flex items-center justify-between px-5 py-4 rounded-lg"
              style={{ background: "rgba(25,25,33,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-[16px] font-medium text-foreground">Licencia: Uso comercial</span>
              <span className="text-[28px] font-bold text-white leading-none">{price}</span>
            </div>

            <div
              className="flex flex-col gap-4 px-5 py-5 rounded-lg"
              style={{ background: "rgba(25,25,33,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <CheckIcon />
                  <span className="text-[16px] text-foreground">{b}</span>
                </div>
              ))}
            </div>

            {hasPurchased ? (
              <div
                className="w-full py-3.5 rounded-pill text-center text-[18px] font-medium"
                style={{ background: "rgba(36,198,95,0.12)", border: "1px solid rgba(36,198,95,0.3)", color: "#24C65F" }}
              >
                {isOwnAsset ? "Tu activo" : "✓ Ya adquirido"}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AcquireButton assetId={asset.id} price={price} isLoggedIn={!!session?.user} />
                {price !== "Gratis" && (
                  <AddToCartButton
                    assetId={asset.id}
                    isLoggedIn={!!session?.user}
                    inCart={inCart}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Description ──────────────────────────────────── */}
      {asset.description && (
        <div className="max-w-screen-xl mx-auto px-6 mt-14">
          <div className="flex flex-col gap-4" style={{ maxWidth: "835px" }}>
            <p className="text-[20px] leading-relaxed" style={{ color: "rgba(242,242,242,0.75)" }}>
              {asset.description}
            </p>
          </div>
        </div>
      )}

      {/* ── Contenido del prompt ──────────────────────────── */}
      {asset.promptContent && (
        <div className="max-w-screen-xl mx-auto px-6 mt-16">
          <div className="flex flex-col gap-5" style={{ maxWidth: "835px" }}>
            <h2 className="text-[25px] font-medium text-foreground">
              {hasPurchased ? "Contenido del activo" : "Vista previa del contenido"}
            </h2>

            {hasPurchased ? (
              /* Contenido completo */
              <div
                className="rounded-xl p-6"
                style={{ background: "rgba(15,14,20,0.9)", border: "1px solid rgba(36,198,95,0.2)" }}
              >
                <pre
                  className="text-[14px] leading-relaxed whitespace-pre-wrap break-words"
                  style={{ fontFamily: "var(--font-mono, monospace)", color: "rgba(242,242,242,0.85)" }}
                >
                  {asset.promptContent}
                </pre>
              </div>
            ) : (
              /* Preview bloqueada */
              <>
                <div className="relative rounded-xl overflow-hidden" style={{ background: "rgba(15,14,20,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <pre
                    className="p-6 text-[14px] leading-relaxed whitespace-pre-wrap break-words overflow-hidden"
                    style={{ fontFamily: "var(--font-mono, monospace)", color: "rgba(242,242,242,0.7)", maxHeight: "200px" }}
                  >
                    {previewText}
                  </pre>
                  <div
                    className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                    style={{ background: "linear-gradient(to top, rgba(15,14,20,1) 0%, transparent 100%)" }}
                    aria-hidden
                  />
                </div>
                <div
                  className="flex items-center gap-3 px-5 py-4 rounded-lg"
                  style={{ background: "rgba(98,60,234,0.08)", border: "1px solid rgba(98,60,234,0.2)" }}
                >
                  <LockIcon />
                  <p className="text-[15px]" style={{ color: "rgba(242,242,242,0.6)" }}>
                    Adquiere este activo para acceder al contenido completo.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── ¿Qué incluye? ────────────────────────────────── */}
      {includes.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-6 mt-16">
          <div className="flex flex-col gap-7" style={{ maxWidth: "586px" }}>
            <h2 className="text-[25px] font-medium text-foreground">¿Qué incluye este activo?</h2>
            <div className="flex flex-col gap-6">
              {includes.map((item) => (
                <div key={item.title} className="flex flex-col gap-1.5">
                  <div className="flex items-start gap-3">
                    <FlowDot />
                    <p className="text-[20px] font-medium text-white leading-snug">{item.title}</p>
                  </div>
                  <p className="text-[16px] leading-relaxed pl-5" style={{ color: "rgba(242,242,242,0.65)" }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Restricciones ────────────────────────────────── */}
      {asset.restrictions.length > 0 && (
        <div className="max-w-screen-xl mx-auto px-6 mt-16 mb-24">
          <div className="flex flex-col gap-7" style={{ maxWidth: "586px" }}>
            <h2 className="text-[25px] font-medium text-foreground">Restricciones de uso</h2>
            <div className="flex flex-col gap-4">
              {asset.restrictions.map((r) => (
                <div key={r} className="flex items-start gap-3">
                  <FlowDot />
                  <p className="text-[16px] leading-relaxed" style={{ color: "rgba(242,242,242,0.65)" }}>{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Reseñas ──────────────────────────────────────── */}
      <ReviewSection
        assetId={asset.id}
        currentUserId={session?.user?.id}
        canReview={hasPurchased && !isOwnAsset}
      />
    </main>
  );
}
