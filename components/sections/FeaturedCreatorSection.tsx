import Link from "next/link";
import { prisma } from "@/lib/db";
import { SimpleProductCard } from "@/components/ui/SimpleProductCard";

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

function avgRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

function formatMemberSince(date: Date): string {
  return date.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
}

async function getTopCreator() {
  // Find the user whose assets have the most total purchases
  const rows = await prisma.$queryRaw<{ userId: string; total: bigint }[]>`
    SELECT a."userId", COUNT(p.id) AS total
    FROM "Purchase" p
    JOIN "Asset" a ON p."assetId" = a.id
    GROUP BY a."userId"
    ORDER BY total DESC
    LIMIT 1
  `;

  // Fallback: creator with most published assets when no sales exist
  const topUserId =
    rows.length > 0
      ? rows[0].userId
      : (
          await prisma.asset.groupBy({
            by: ["userId"],
            where: { status: "PUBLISHED" },
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 1,
          })
        )[0]?.userId;

  if (!topUserId) return null;

  return prisma.user.findUnique({
    where: { id: topUserId },
    include: {
      assets: {
        where: { status: "PUBLISHED" },
        include: { reviews: { select: { rating: true } } },
        orderBy: { purchases: { _count: "desc" } },
        take: 4,
      },
    },
  });
}

export async function FeaturedCreatorSection({ className = "" }: { className?: string }) {
  const creator = await getTopCreator();

  if (!creator || creator.assets.length === 0) return null;

  const products = creator.assets.map((asset) => ({
    id: asset.id,
    title: asset.title,
    author: creator.name ?? creator.username,
    price: formatPrice(asset.price),
    image: asset.coverImage ?? null,
    href: `/p/${asset.slug}`,
    type: asset.type as "PROMPT" | "FLUJO" | "AGENTE",
    rating: avgRating(asset.reviews),
  }));

  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col gap-14">
        {/* Header row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
          {/* Left sidebar */}
          <div className="flex flex-col gap-6 lg:w-[330px] shrink-0">
            <div className="flex flex-col gap-2">
              <p className="text-[31px] font-bold text-foreground leading-[1.25]">
                Creador destacado
              </p>
              <p className="text-[24px] font-normal text-foreground leading-[1.25]">
                {creator.name ?? creator.username}
              </p>
              <p
                className="text-[16px] font-normal leading-[1.5]"
                style={{ color: "rgba(242,242,242,0.6)" }}
              >
                Miembro desde {formatMemberSince(creator.createdAt)}
              </p>
            </div>

            <Link
              href={`/u/${creator.username}`}
              className="inline-flex items-center justify-center w-fit rounded-pill px-8 py-2 text-base font-normal text-white transition-opacity hover:opacity-90"
              style={{
                background:
                  "linear-gradient(180deg, rgba(98,60,234,1) 0%, rgba(55,34,132,1) 94%)",
                boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
              }}
            >
              Ver proyectos
            </Link>
          </div>

          {/* Right: description */}
          <p
            className="flex-1 text-[16px] font-normal text-foreground"
            style={{ lineHeight: "2.25" }}
          >
            Nuestros activos y automatizaciones son desarrollados por ingenieros
            de prompts de clase mundial (o Arquitectos, como los llamamos
            nosotros). Explora lo mejor de la semana.
          </p>
        </div>

        {/* Products row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <SimpleProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
