import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SimpleProductCard } from "@/components/ui/SimpleProductCard";
import type { AssetType } from "@/app/generated/prisma/enums";

function VerifiedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#623cea" aria-hidden>
      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
  );
}

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

async function getExpert(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      role: true,
      createdAt: true,
      assets: {
        where: { status: "PUBLISHED" },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          price: true,
          coverImage: true,
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getExpert(username);
  if (!user || (user.role !== "EXPERTO" && user.role !== "ADMIN")) {
    return { title: "Perfil no encontrado — ShareMyPrompt" };
  }
  const displayName = user.name ?? username;
  return {
    title: `${displayName} — ShareMyPrompt`,
    description: `Explora los activos de IA publicados por ${displayName} en ShareMyPrompt.`,
  };
}

export default async function ExpertProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getExpert(username);

  if (!user || (user.role !== "EXPERTO" && user.role !== "ADMIN")) {
    notFound();
  }

  const initials = (user.name ?? user.username)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const joined = new Date(user.createdAt).toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const count = user.assets.length;

  return (
    <main className="min-h-screen bg-surface pt-[80px]">
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[500px] opacity-[0.1] -z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, #5D35FF 0%, #3AF4BC 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pt-12 pb-32">
        {/* Breadcrumb */}
        <nav className="mb-10" aria-label="Breadcrumb">
          <Link
            href="/explorer"
            className="text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "rgba(242,242,242,0.5)" }}
          >
            ← Volver al explorador
          </Link>
        </nav>

        {/* Profile header */}
        <div
          className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-12"
          style={{ borderBottom: "1px solid rgba(242,242,242,0.08)" }}
        >
          {/* Avatar */}
          <div
            className="flex items-center justify-center w-24 h-24 rounded-full text-[26px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #623CEA 0%, #372284 100%)" }}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1
                className="text-[30px] font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {user.name ?? user.username}
              </h1>
              <VerifiedIcon />
              <span
                className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded"
                style={{
                  background: "rgba(98,60,234,0.2)",
                  color: "#9d7ef7",
                  border: "1px solid rgba(98,60,234,0.3)",
                }}
              >
                Experto
              </span>
            </div>

            <p className="text-[15px]" style={{ color: "rgba(242,242,242,0.45)" }}>
              @{user.username}
            </p>

            <p className="text-[13px]" style={{ color: "rgba(242,242,242,0.3)" }}>
              Miembro desde {joined}
              {" · "}
              {count} activo{count !== 1 ? "s" : ""} publicado{count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Assets */}
        <div className="pt-12 flex flex-col gap-8">
          <h2
            className="text-[20px] font-bold text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Activos publicados
          </h2>

          {count === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <p className="text-[16px] font-semibold text-white">Sin activos publicados aún</p>
              <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.4)" }}>
                Este experto aún no ha publicado ningún activo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {user.assets.map((asset) => (
                <SimpleProductCard
                  key={asset.id}
                  id={asset.id}
                  title={asset.title}
                  author={user.name ?? `@${user.username}`}
                  price={formatPrice(asset.price)}
                  image={asset.coverImage}
                  href={`/p/${asset.slug}`}
                  type={asset.type as AssetType}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
